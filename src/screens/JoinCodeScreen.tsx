import React, {useEffect, useRef, useState} from 'react';
import {CustomBottomSheet} from '../shared/Reusables';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useAppDispatch} from '../shared/rdx-hooks';
import {setSessionGame} from '../shared/rdx-slice';
import { BASE_URL } from '../api/config';
import {useNavigation} from '@react-navigation/native';
import ElementIcon from '../assets/images/element-icon.svg';
import ElementIconCircle from '../assets/images/element-icon-circle.svg';
import Loader from '../assets/images/loader.svg';
import LottieView from 'lottie-react-native';
import {TSession} from '../shared/types';
import {useSignalR} from '../hooks/useSignalR';

const JoinCodeScreen = React.memo(
  React.forwardRef((props: any, ref: any) => {
    const navigation = useNavigation();
    const [inputPin, setInputPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [confetti, setConfetti] = useState(false);
    const dispatch = useAppDispatch();
    const rotation = useRef(new Animated.Value(0)).current;
    const inputPinRef = useRef('');
    const connection = useSignalR(`${BASE_URL}/gameHub`);

    useEffect(() => {
      if (loading) {
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

    const rotate = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    useEffect(() => {
      inputPinRef.current = inputPin;
    }, [inputPin]);
    useEffect(() => {
      if (connection) {
        connection.on('RoomExists', (exists, idsession) => {
          if (exists) {
            const session: TSession = {
              idsession,
              pin: inputPinRef.current,
            };
            dispatch(setSessionGame(session));
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setConfetti(true);
              setTimeout(() => {
                setConfetti(false);
                setInputPin('');
                ref.current.close();
                navigation.navigate('EduQuizGameScreen');
              }, 1500);
            }, 1500);
          } else {
            showMessage({
              message: 'Không tìm thấy phiên chơi!',
              type: 'danger',
              duration: 2000,
              autoHide: true,
              style: {justifyContent: 'center', alignItems: 'center'},
            });
          }
        });
      }
    }, [connection]);

    const handleJoinGame = async () => {
      if (connection && inputPin) {
        try {
          await connection.invoke('GetSessionQuizRoom', inputPin);
        } catch (err) {
          console.error('Lỗi khi tham gia trò chơi:', err);
        }
      }
    };
    return (
      <CustomBottomSheet height={'92%'} ref={ref}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1, position: 'relative'}}>
          <View style={{flex: 1}}>
            {confetti ? (
              <LottieView
                style={{zIndex: 2, width: '100%', height: '100%', flex: 1}}
                source={require('../assets/lottie/confetti.json')}
                autoPlay
                loop
              />
            ) : (
              <>
                <View style={styles.iconView}>
                  <ElementIcon width={350} height={350} />
                </View>
                <View style={styles.iconViewCircle}>
                  <ElementIconCircle width={350} height={350} />
                </View>

                {loading ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 2,
                    }}>
                    <Animated.View style={{transform: [{rotate}]}}>
                      <Loader width={100} height={100} />
                    </Animated.View>
                  </View>
                ) : (
                  <>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: 20,
                        color: '#fff',
                        zIndex: 2,
                      }}>
                      Tham gia trò chơi
                    </Text>
                    <TextInput
                      placeholder="Nhập mã PIN"
                      style={styles.inputPin}
                      keyboardType="numeric"
                      value={inputPin}
                      onChangeText={text => setInputPin(text)}
                      placeholderTextColor="white"
                    />
                    {inputPin ? (
                      <TouchableOpacity
                        style={[styles.buttonStyle]}
                        activeOpacity={0.7}
                        onPress={handleJoinGame}>
                        <Text style={styles.buttonText}>Tham gia</Text>
                      </TouchableOpacity>
                    ) : null}
                    <View style={styles.noteView}>
                      <View style={styles.enterView}>
                        <Text style={styles.enterText}>Nhập Pin</Text>
                      </View>
                      <Text style={styles.noteText}>
                        Vui lòng nhập mã pin để vào phòng
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </CustomBottomSheet>
    );
  }),
);

const styles = StyleSheet.create({
  iconView: {
    zIndex: 1,
    position: 'absolute',
    top: '70%',
    left: '30%',
    display: 'flex',
    verticalAlign: 'middle',
    transform: [{rotate: '45deg'}],
  },
  iconViewCircle: {
    zIndex: 1,
    position: 'absolute',
    top: '15%',
    left: '-30%',
    display: 'flex',
    verticalAlign: 'middle',
    transform: [{rotate: '45deg'}],
  },
  inputPin: {
    width: '100%',
    height: 150,
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 2,
  },
  buttonStyle: {
    bottom: '24%',
    position: 'absolute',
    width: 250,
    height: 50,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
    transform: [{translateY: 0}],
    borderWidth: 5,
    borderStartWidth: 1,
    borderTopWidth: 0,
    borderEndWidth: 2,
    borderColor: '#016b01',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  noteView: {
    position: 'absolute',
    bottom: '10%',
    width: '90%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 10,
    alignSelf: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  enterView: {
    width: '50%',
    height: '90%',
    backgroundColor: '#1d43a5',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  noteText: {
    width: '50%',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
export default JoinCodeScreen;
