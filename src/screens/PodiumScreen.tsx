import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import apiCall, {API_ENDPOINTS, BASE_URL} from '../api/config';
import {useSignalR} from '../hooks/useSignalR';
import {useAppSelector} from '../shared/rdx-hooks';
import {FastImageRes} from '../shared/Reusables';
import {BACKGROUND_PODIUM, showCustomMessage} from '../shared/constants';
import {SvgCssUri} from 'react-native-svg/css';
import BodyIcon from '../assets/images/body.svg';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import Svg, {Path} from 'react-native-svg';

const getColor = (state, value) => {
  if (state === null) return 'rgb(178, 178, 178)';
  return state === value
    ? value
      ? 'rgb(102, 191, 57)'
      : 'rgb(255, 51, 85)'
    : 'rgb(178, 178, 178)';
};

const getColor2 = (state, value) => {
  if (state === null) return 'rgb(178, 178, 178)';
  if (state === value) {
    if (value === 1) return 'rgb(102, 191, 57)';
    if (value === 2) return 'rgb(255, 166, 2)';
    if (value === 0) return 'rgb(255, 51, 85)';
  }
  return 'rgb(178, 178, 178)';
};
const PodiumScreen = React.memo((props: any) => {
  const quizSession = useAppSelector(state => state.main.sessionGame);
  const connection = useSignalR(API_ENDPOINTS.GAMECONECTION);
  const {playerWithRank} = props.route.params;
  const [showConfetti, setShowConfetti] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [selectedStars, setSelectedStars] = useState(Array(5).fill(false));
  const [learned, setLearned] = useState(null);
  const [liked, setLiked] = useState(null);
  const [feeling, setFeeling] = useState(null);

  const handleStarPress = index => {
    const newStars = selectedStars.map((item, i) => {
      if (i <= index) {
        return true;
      } else {
        return false;
      }
    });
    setSelectedStars(newStars);
  };
  const submitFeedback = async () => {
    const datasend = {
      QuizSessionId: quizSession.idsession,
      Rating: selectedStars.filter(star => star).length,
      PositiveLearningOutcome: learned,
      Liked: liked,
      PositiveFeeling: feeling,
    };
    try {
      await apiCall('POST', API_ENDPOINTS.FEEDBACK_ENDPOINT, datasend);
      setModalVisible(false);
      showCustomMessage('Cảm ơn bạn đã đánh giá thành công!', 'success');
    } catch (error) {
      showCustomMessage('Lỗi khi gửi phản hồi!', 'danger');
    }
  };

  useEffect(() => {
    const fadeOutTimeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setShowConfetti(false));
    }, 8000);

    return () => clearTimeout(fadeOutTimeout);
  }, [fadeAnim]);
  useEffect(() => {
    if (connection) {
      const reconnectPlayer = async () => {
        if (connection) {
          await connection.invoke('ReConnectGetFeedback', quizSession.pin);
          connection.off('GetFeedback');
          connection.on('GetFeedback', async() => {
            setModalVisible(true);
          });
        }
      };
      reconnectPlayer();
    }
  }, [connection]);
  const outGame = () => {
    props.navigation.goBack();
  };
  return (
    <View style={styles.mainView}>
      <FastImageRes uri={BACKGROUND_PODIUM} />
              <TouchableOpacity style={styles.button} onPress={outGame}>
                  <Text style={styles.text}>✖</Text>
                </TouchableOpacity>
      {showConfetti && (
        <Animated.View style={[styles.confetti, {opacity: fadeAnim}]}>
          <LottieView
            style={{
              zIndex: 6,
              position: 'absolute',
              top: -240,
              left: 0,
              right: 0,
              height: '100%',
            }}
            source={require('../assets/lottie/confetti-rain.json')}
            autoPlay
            loop
          />
          <LottieView
            style={{
              zIndex: 6,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
            }}
            source={require('../assets/lottie/confetti-rain.json')}
            autoPlay
            loop
          />
          <LottieView
            style={{
              zIndex: 6,
              position: 'absolute',
              top: 300,
              left: 0,
              right: 0,
              height: '100%',
            }}
            source={require('../assets/lottie/confetti-rain.json')}
            autoPlay
            loop
          />
        </Animated.View>
      )}

      <View style={styles.viewWrapper}>
        <Text style={[styles.textRank, {fontSize: 35}]}>
          Top {playerWithRank.rank}
        </Text>
        <Text style={styles.textRank}>{playerWithRank.nickname}</Text>
        <Text style={[styles.textRank,{marginBottom:20}]}>
          · {playerWithRank.totalScore} điểm ·
        </Text>
        <View style={styles.playerAvatar}>
          <SvgCssUri
            width="100%"
            height="100%"
            uri={`${BASE_URL}${playerWithRank.avatarUrl}`}
            style={styles.viewAvatar}
          />
          <SvgCssUri
            width="100%"
            height="100%"
            uri={`${BASE_URL}${playerWithRank.accessory}`}
            style={styles.viewAccessory}
          />
          <View style={styles.viewEyes}>
            <FastImageRes uri={`${BASE_URL}/src/img/eyes-blink.gif`} />
          </View>
        </View>
        <View style={styles.bodyView}>
          <BodyIcon width={180} height={220} />
        </View>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.viewFeedback}>
          <Text style={styles.textTitle}>
            Bạn đánh giá thế nào về EduQuiz này?
          </Text>
          <View style={{flexDirection: 'row', gap: 12}}>
            {selectedStars.map((isSelected, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}>
                <Svg viewBox="0 0 48 48" width={45} height={45}>
                  <Path
                    d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"
                    fill={isSelected ? '#ffc00a' : 'rgb(178, 178, 178)'}
                  />
                </Svg>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.textTitle}>Bạn có học được điều gì không?</Text>
          <View style={{flexDirection: 'row', gap: 12}}>
            <TouchableOpacity onPress={() => setLearned(true)}>
              <Svg viewBox="0 0 32 32" width={45} height={45}>
                <Path
                  d="M16,0 C24.8363636,0 32,7.16363636 32,16 C32,24.8363636 24.8363636,32 16,32 C7.16363636,32 0,24.8363636 0,16 C0,7.16363636 7.16363636,0 16,0 Z M21.8181818,17.0909091 C21.8181818,16.4 21.2727273,15.8181818 20.5818182,15.8181818 C21.2727273,15.8181818 21.8181818,15.2727273 21.8181818,14.5818182 C21.8181818,13.8909091 21.2727273,13.3454545 20.5818182,13.3454545 L15.6727273,13.3454545 L16.6181818,10.8363636 C17.1272727,9.45454545 16.4727273,7.96363636 15.1272727,7.45454545 C13.7818182,6.98181818 12.2909091,7.67272727 11.7818182,9.05454545 L10.1818182,13.3454545 L10.1818182,23.3090909 L15.4181818,23.3090909 L20.5818182,23.3090909 C21.2727273,23.3090909 21.8181818,22.7272727 21.8181818,22.0363636 C21.8181818,21.3454545 21.2727273,20.8 20.5818182,20.8 C21.2727273,20.8 21.8181818,20.2545455 21.8181818,19.5636364 C21.8181818,18.8727273 21.2727273,18.3272727 20.5818182,18.3272727 C21.2727273,18.3272727 21.8181818,17.7818182 21.8181818,17.0909091 Z"
                  fill={getColor(learned, true)}
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLearned(false)}>
              <Svg viewBox="0 0 32 32" width={45} height={45}>
                <Path
                  d="M16,32 C7.16363636,32 0,24.8363636 0,16 C0,7.16363636 7.16363636,0 16,0 C24.8363636,0 32,7.16363636 32,16 C32,24.8363636 24.8363636,32 16,32 Z M10.1818182,14.9090909 C10.1818182,15.6 10.7272727,16.1818182 11.4181818,16.1818182 C10.7272727,16.1818182 10.1818182,16.7272727 10.1818182,17.4181818 C10.1818182,18.1090909 10.7272727,18.6545455 11.4181818,18.6545455 L16.3272727,18.6545455 L15.3818182,21.1636364 C14.8727273,22.5454545 15.5272727,24.0363636 16.8727273,24.5454545 C18.2181818,25.0181818 19.7090909,24.3272727 20.2181818,22.9454545 L21.8181818,18.6545455 L21.8181818,8.69090909 L16.5818182,8.69090909 L11.4181818,8.69090909 C10.7272727,8.69090909 10.1818182,9.27272727 10.1818182,9.96363636 C10.1818182,10.6545455 10.7272727,11.2 11.4181818,11.2 C10.7272727,11.2 10.1818182,11.7454545 10.1818182,12.4363636 C10.1818182,13.1272727 10.7272727,13.6727273 11.4181818,13.6727273 C10.7272727,13.6727273 10.1818182,14.2181818 10.1818182,14.9090909 Z"
                  fill={getColor(learned, false)}
                />
              </Svg>
            </TouchableOpacity>
          </View>
          <Text style={styles.textTitle}>Bạn có thích nó không?</Text>
          <View style={{flexDirection: 'row', gap: 12}}>
            <TouchableOpacity onPress={() => setLiked(true)}>
              <Svg viewBox="0 0 32 32" width={45} height={45}>
                <Path
                  d="M16,0 C24.8363636,0 32,7.16363636 32,16 C32,24.8363636 24.8363636,32 16,32 C7.16363636,32 0,24.8363636 0,16 C0,7.16363636 7.16363636,0 16,0 Z M21.8181818,17.0909091 C21.8181818,16.4 21.2727273,15.8181818 20.5818182,15.8181818 C21.2727273,15.8181818 21.8181818,15.2727273 21.8181818,14.5818182 C21.8181818,13.8909091 21.2727273,13.3454545 20.5818182,13.3454545 L15.6727273,13.3454545 L16.6181818,10.8363636 C17.1272727,9.45454545 16.4727273,7.96363636 15.1272727,7.45454545 C13.7818182,6.98181818 12.2909091,7.67272727 11.7818182,9.05454545 L10.1818182,13.3454545 L10.1818182,23.3090909 L15.4181818,23.3090909 L20.5818182,23.3090909 C21.2727273,23.3090909 21.8181818,22.7272727 21.8181818,22.0363636 C21.8181818,21.3454545 21.2727273,20.8 20.5818182,20.8 C21.2727273,20.8 21.8181818,20.2545455 21.8181818,19.5636364 C21.8181818,18.8727273 21.2727273,18.3272727 20.5818182,18.3272727 C21.2727273,18.3272727 21.8181818,17.7818182 21.8181818,17.0909091 Z"
                  fill={getColor(liked, true)}
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLiked(false)}>
              <Svg viewBox="0 0 32 32" width={45} height={45}>
                <Path
                  d="M16,32 C7.16363636,32 0,24.8363636 0,16 C0,7.16363636 7.16363636,0 16,0 C24.8363636,0 32,7.16363636 32,16 C32,24.8363636 24.8363636,32 16,32 Z M10.1818182,14.9090909 C10.1818182,15.6 10.7272727,16.1818182 11.4181818,16.1818182 C10.7272727,16.1818182 10.1818182,16.7272727 10.1818182,17.4181818 C10.1818182,18.1090909 10.7272727,18.6545455 11.4181818,18.6545455 L16.3272727,18.6545455 L15.3818182,21.1636364 C14.8727273,22.5454545 15.5272727,24.0363636 16.8727273,24.5454545 C18.2181818,25.0181818 19.7090909,24.3272727 20.2181818,22.9454545 L21.8181818,18.6545455 L21.8181818,8.69090909 L16.5818182,8.69090909 L11.4181818,8.69090909 C10.7272727,8.69090909 10.1818182,9.27272727 10.1818182,9.96363636 C10.1818182,10.6545455 10.7272727,11.2 11.4181818,11.2 C10.7272727,11.2 10.1818182,11.7454545 10.1818182,12.4363636 C10.1818182,13.1272727 10.7272727,13.6727273 11.4181818,13.6727273 C10.7272727,13.6727273 10.1818182,14.2181818 10.1818182,14.9090909 Z"
                  fill={getColor(liked, false)}
                />
              </Svg>
            </TouchableOpacity>
          </View>
          <Text style={styles.textTitle}>
            Hãy cho chúng tôi biết bạn cảm thấy thế nào?
          </Text>
          <View style={{flexDirection: 'row', gap: 12}}>
            <TouchableOpacity onPress={() => setFeeling(1)}>
              <Svg viewBox="0 0 32 32" width={45} height={45}>
                <Path
                  d="M16,0 C7.16363636,0 0,7.16363636 0,16 C0,24.8363636 7.16363636,32 16,32 C24.8363636,32 32,24.8363636 32,16 C32,7.16363636 24.8363636,0 16,0 Z M10.1818182,9.45454545 C11.3818182,9.45454545 12.3636364,10.4363636 12.3636364,11.6363636 C12.3636364,12.8363636 11.3818182,13.8181818 10.1818182,13.8181818 C8.98181818,13.8181818 8,12.8363636 8,11.6363636 C8,10.4363636 8.98181818,9.45454545 10.1818182,9.45454545 Z M16,24 C11.5636364,24 8,20.2181818 8,16 L24,16 C24,20.2181818 20.4363636,24 16,24 Z M21.8181818,13.8181818 C20.6181818,13.8181818 19.6363636,12.8363636 19.6363636,11.6363636 C19.6363636,10.4363636 20.6181818,9.45454545 21.8181818,9.45454545 C23.0181818,9.45454545 24,10.4363636 24,11.6363636 C24,12.8363636 23.0181818,13.8181818 21.8181818,13.8181818 Z"
                  fill={getColor2(feeling, 1)}
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFeeling(2)}>
              <Svg viewBox="0 0 32 32" width={45} height={45}>
                <Path
                  d="M16,0 C7.15428571,0 0,7.15428571 0,16 C0,24.8457143 7.15428571,32 16,32 C24.8457143,32 32,24.8457143 32,16 C32,7.15428571 24.8457143,0 16,0 Z M10.1714286,9.46285714 C11.36,9.46285714 12.3428571,10.4457143 12.3428571,11.6342857 C12.3428571,12.8228571 11.36,13.8057143 10.1714286,13.8057143 C8.98285714,13.8057143 8,12.8457143 8,11.6342857 C8,10.4228571 8.98285714,9.46285714 10.1714286,9.46285714 Z M24,21.8285714 L8,21.8285714 L8,18.1714286 L24,18.1714286 L24,21.8285714 Z M21.8285714,13.8285714 C20.64,13.8285714 19.6571429,12.8457143 19.6571429,11.6571429 C19.6571429,10.4685714 20.64,9.48571429 21.8285714,9.48571429 C23.0171429,9.48571429 24,10.4685714 24,11.6571429 C24,12.8457143 23.0171429,13.8285714 21.8285714,13.8285714 Z"
                  fill={getColor2(feeling, 2)}
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFeeling(0)}>
              <Svg viewBox="0 0 32 32" width={45} height={45}>
                <Path
                  d="M16,0 C7.16363636,0 0,7.16363636 0,16 C0,24.8363636 7.16363636,32 16,32 C24.8363636,32 32,24.8363636 32,16 C32,7.16363636 24.8363636,0 16,0 Z M10.1818182,9.45454545 C11.3818182,9.45454545 12.3636364,10.4363636 12.3636364,11.6363636 C12.3636364,12.8363636 11.3818182,13.8181818 10.1818182,13.8181818 C8.98181818,13.8181818 8,12.8363636 8,11.6363636 C8,10.4363636 8.98181818,9.45454545 10.1818182,9.45454545 Z M20.5090909,24 C20.5090909,21.4909091 18.4727273,19.4909091 16,19.4909091 C13.4909091,19.4909091 11.4909091,21.5272727 11.4909091,24 L8,24 C8,19.5636364 11.5636364,16 16,16 C20.4363636,16 24,19.5636364 24,24 L20.5090909,24 Z M21.8181818,13.8181818 C20.6181818,13.8181818 19.6363636,12.8363636 19.6363636,11.6363636 C19.6363636,10.4363636 20.6181818,9.45454545 21.8181818,9.45454545 C23.0181818,9.45454545 24,10.4363636 24,11.6363636 C24,12.8363636 23.0181818,13.8181818 21.8181818,13.8181818 Z"
                  fill={getColor2(feeling, 0)}
                />
              </Svg>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.btnSubmit} onPress={submitFeedback}>
            <Text style={styles.textFeedback}>Gửi đánh giá</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
});

export default PodiumScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 6,
  },
  viewWrapper: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 220,
  },
  playerAvatar: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  viewAvatar: {
    position: 'absolute',
    zIndex: 1,
  },
  viewAccessory: {
    position: 'absolute',
    zIndex: 3,
  },
  viewEyes: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: '100%',
  },
  bodyView: {
    position: 'absolute',
    zIndex: 2,
    top: 160,
    left: -30,
  },
  textRank: {
    marginTop: 6,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    textShadowColor: '#333',
  },
  viewFeedback: {
    backgroundColor: '#fff',
    height: 500,
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  btnSubmit: {
    backgroundColor: '#26890c',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 'auto',
    justifyContent: 'center',
  },
  textFeedback: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 12,
  }, text: {
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
});
