import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TextInput,
} from 'react-native';
import React, {useEffect, useReducer, useRef} from 'react';
import ElementIcon from '../assets/images/element-icon.svg';
import ElementIconCircle from '../assets/images/element-icon-circle.svg';
import {showCustomMessage} from '../shared/constants';
import Logo from '../assets/images/logotext.svg';
import { useAppSelector} from '../shared/rdx-hooks';
import {gameReducer, initialState} from '../shared/reducers/gameReducer';
import {useSignalR} from '../hooks/useSignalR';
import LoadingOverlay from '../components/LoadingOverlay';
import AvatarEditor from '../components/game/AvatarEditor';
import apiCall, {API_ENDPOINTS} from '../api/config';
import {BASE_URL} from '../api/config';
import GameMain from '../components/game/GameMain';

const EduQuizGameScreen = React.memo((props: any) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const connection = useSignalR(API_ENDPOINTS.GAMECONECTION);
  const {name, loading, isStart, joinGame, data, isClose, countquestions} =
    state;
  const rotation = useRef(new Animated.Value(0)).current;
  const quizSession = useAppSelector(state => state.main.sessionGame);
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        dispatch({type: 'SET_LOADING', payload: false});
      }, 600);
      const animation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 600,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      );
      animation.start();
      return () => {
        animation.stop();
        rotation.setValue(0);
      };
    } else {
      rotation.setValue(0);
    }
  }, [loading]);
  useEffect(() => {
    if (isClose) {
      props.navigation.goBack();
    }
  }, [isClose]);

  useEffect(() => {
    if (connection) {
      dispatch({type: 'SET_CONNECTED', payload: connection});
      connection.off('RoomDelete');
      connection.on('RoomDelete', async exists => {
        if (exists) {
          dispatch({type: 'SET_CLOSE', payload: true});
        }
      });
      connection.off('RoomNotFound');
      connection.on('RoomNotFound', async exists => {
        if (exists) {
          dispatch({type: 'SET_CLOSE', payload: true});
        }
      });
      connection.on('RoomLock', async exists => {
        if (exists) {
          showCustomMessage('Phòng tham gia đã bị khóa!', 'danger');
        }
      });
      connection.on('RoomFull', async exists => {
        if (exists) {
          showCustomMessage(
            'Số lượng người chơi trong phòng đã đầy!',
            'danger',
          );
        }
      });
      connection.on('NameCheck', async exists => {
        if (exists) {
          showCustomMessage('Tên người chơi đã tồn tại!', 'danger');
        }
      });
      connection.off('PlayerOut');
      connection.on('PlayerOut', async (exists, playercurrent) => {
        if (exists && data.idPlayer == playercurrent) {
          dispatch({type: 'SET_CLOSE', payload: true});
        }
      });
      connection.off('SendQuestion');
      connection.on('SendQuestion', async (quizoption, question) => {
        dispatch({type: 'SET_QUESTION', payload: {quizoption, question}});
        if (countquestions === 0) {
          dispatch({type: 'SET_IS_START', payload: true});
          dispatch({type: 'SET_LOADING_GAME', payload: true});

          setTimeout(() => {
            dispatch({type: 'SET_LOADING_GAME', payload: false});
          }, 7500);
        }
      });
      connection.off('StartCountdown');
      connection.on('StartCountdown', async exists => {
        if (exists) {
          dispatch({type: 'SET_COUNTDOWN_STARTED', payload: true});
        }
      });
      connection.off('TimeUp');
      connection.on('TimeUp', async response => {
        if (response) {
          const playerAnswers = response.filter(
            answer => answer.playerId === data.idPlayer,
          );
          let totalPoints = 0;
          let isCorrect = false;
          if (playerAnswers.length > 0) {
            playerAnswers.forEach(playerAnswer => {
              totalPoints += playerAnswer.isCorrect ? playerAnswer.score : 0;
              if (playerAnswer.isCorrect) {
                isCorrect = true;
              }
            });
            dispatch({
              type: 'SET_STATUS_SCORE_CURRENTQUESTION',
              payload: isCorrect ? 1 : 2,
            });
            dispatch({type: 'SET_SCORE_CURRENTQUESTION', payload: totalPoints});
            dispatch({type: 'SET_SCORE', payload: totalPoints});
          } else {
            dispatch({type: 'SET_STATUS_SCORE_CURRENTQUESTION', payload: 0});
          }
          dispatch({type: 'SET_WAITINGRESULT', payload: false});
          dispatch({type: 'SET_COUNTDOWN_STARTED', payload: false});
        }
      });
      connection.off('FinishedQuiz');
      connection.on('FinishedQuiz', async response => {
        if (response) {
          const currentPlayer = response.find(
            player => player.id === data.idPlayer,
          );
          if (currentPlayer) {
            const rank = response.indexOf(currentPlayer) + 1;
            const playerWithRank = {
              ...currentPlayer,
              rank: rank,
            };
            props.navigation.replace('PodiumScreen', {
              playerWithRank: playerWithRank,
            });
          }
        }
      });
      connection.on('PlayerJoined', async (exists, connectId) => {
        if (exists) {
          dispatch({type: 'SET_JOIN_GAME', payload: true});
          try {
            const datasend = {ConnectId: connectId};
            const dataResponse = await apiCall(
              'POST',
              API_ENDPOINTS.QUIZ_SESSION_ENDPOINT,
              datasend,
            );
            await connection.invoke('ReConnectPlayer', quizSession.pin);
            dispatch({type: 'SET_NAME', payload: dataResponse.nickname});
            dispatch({
              type: 'SET_BACKGROUND',
              payload: `${BASE_URL}${dataResponse.theme}`,
            });
            dispatch({
              type: 'SET_AVATAR',
              payload: `${BASE_URL}${dataResponse.avatar}`,
            });
            dispatch({
              type: 'SET_ACCESSORY',
              payload: `${BASE_URL}${dataResponse.accessory}`,
            });
            dispatch({type: 'SET_JOIN_GAME', payload: true});
            dispatch({type: 'SET_DATA', payload: dataResponse});
          } catch (err) {
            console.error('Lỗi khi lấy session:', err);
          }
        }
      });
    }
  }, [connection, data, countquestions]);
  const outGame = async () => {
    if (data != null) {
      if (connection) {
        await connection.invoke(
          'PlayerOutRoom',
          quizSession.pin,
          data.idPlayer,
        );
      }
    }
    props.navigation.goBack();
  };

  const submitName = async () => {
    if (name.trim() === '') {
      dispatch({type: 'SET_IS_START', payload: true});
      dispatch({type: 'SET_COUNTDOWN_STARTED', payload: true});
      showCustomMessage('Vui lòng nhập tên!', 'danger');
    } else {
      dispatch({type: 'SET_LOADING', payload: true});
      if (connection && name) {
        try {
          await connection.invoke(
            'AddPlayerToWaitingRoom',
            quizSession.pin,
            name,
            quizSession.idsession,
          );
        } catch (err) {
          console.error('Lỗi khi tham gia trò chơi:', err);
          dispatch({type: 'SET_LOADING', payload: false});
        }
      }
    }
  };
  return (
    <View style={[styles.container]}>
      {!isStart ? (
        <>
          {joinGame && <AvatarEditor state={state} dispatch={dispatch} />}
          {loading && <LoadingOverlay rotation={rotation} />}
          <TouchableOpacity style={styles.button} onPress={outGame}>
            <Text style={styles.text}>✖</Text>
          </TouchableOpacity>
          {!joinGame && (
            <>
              <View style={styles.iconViewSquare}>
                <ElementIcon width={450} height={450} />
              </View>
              <View style={styles.iconViewCircle}>
                <ElementIconCircle width={550} height={550} />
              </View>
              <Logo width={250} height={90} style={styles.logoView} />
              <View style={styles.content}>
                <TextInput
                  placeholder="Nhập tên"
                  style={styles.input}
                  value={name}
                  onChangeText={text =>
                    dispatch({type: 'SET_NAME', payload: text})
                  }
                />
                <TouchableOpacity
                  style={styles.buttonSubmit}
                  onPress={submitName}>
                  <Text style={styles.textSubmit}>Đồng ý</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      ) : (
        <GameMain state={state} dispatch={dispatch} />
      )}
    </View>
  );
});

export default EduQuizGameScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d43a5',
  },
  logoView: {
    marginTop: 50,
    zIndex: 1,
    marginBottom: 30,
  },
  buttonSubmit: {
    marginTop: 16,
    backgroundColor: '#333',
    height: 50,
    width: '100%',
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderStartWidth: 1,
    borderTopWidth: 0,
    borderEndWidth: 2,
  },
  textSubmit: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  content: {
    height: 140,
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  text: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    height: 45,
    width: 45,
    borderRadius: '50%',
    position: 'absolute',
    top: 20,
    left: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconViewSquare: {
    zIndex: 1,
    position: 'absolute',
    top: '70%',
    left: '20%',
    display: 'flex',
    transform: [{rotate: '45deg'}],
  },
  iconViewCircle: {
    zIndex: 1,
    position: 'absolute',
    top: '-25%',
    left: '-60%',
    display: 'flex',
    transform: [{rotate: '45deg'}],
  },
});
