import {View, Text, StyleSheet, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FastImageRes} from '../../shared/Reusables';
import {ICON_QUESTION,TEXT_TYPE_QUESTION} from '../../shared/constants';

const IntroQuestion = React.memo(({state, dispatch}: {state: any; dispatch: React.Dispatch<any>}) => {
  const {question} = state;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [showWrapper, setShowWrapper] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleWrapperAnim = useRef(new Animated.Value(0.3)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.4,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setShowWrapper(true);

      Animated.timing(progressWidth, {
        toValue: 0.9,
        duration: 3800, 
        useNativeDriver: false, 
      }).start();

      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleWrapperAnim, {
          toValue: 1.1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleWrapperAnim, {
          toValue: 0.89,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleWrapperAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1200);
  }, []);

  return (
    <View style={styles.container}>
      {!showWrapper ? (
        <>
          <Animated.View
            style={[styles.iconView, {transform: [{scale: scaleAnim}]}]}>
            <FastImageRes uri={ICON_QUESTION(`${question.question.typeQuestion}`)} />
          </Animated.View>
          <Animated.View
            style={[styles.wrapperView, {transform: [{scale: scaleAnim}]}]}>
            <Text style={styles.textTitle}>{TEXT_TYPE_QUESTION(`${question.question.typeQuestion}`)}</Text>
          </Animated.View>
        </>
      ) : (
        <>
          <Animated.View
            style={[
              styles.wrapperQuestion,
              {
                opacity: opacityAnim,
                transform: [{scale: scaleWrapperAnim}],
              },
            ]}>
            <Text style={styles.textQuestion}>{question.question.questionText}</Text>
          </Animated.View>
          <Animated.View
            style={[styles.progressView, { width: progressWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }) }]}
          ></Animated.View>
        </>
      )}
    </View>
  );
});

export default IntroQuestion;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconView: {
    width: 65,
    height: 65,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperView: {
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  wrapperQuestion: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,.9)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  textQuestion: {
    fontSize: 34,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressView: {
    position: 'absolute',
    bottom: 70,
    left:20,
    height: 16,
    backgroundColor: '#1d43a5',
    borderRadius: 16 / 2,
    width: '100%', 
    alignSelf: 'flex-start',
  },
});
