import {
  View,
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LoadingGame from './LoadingGame';
import {FastImageRes} from '../../shared/Reusables';
import BottomGame from './BottomGame';
import TopGame from './TopGame';
import IntroQuestion from './IntroQuestion';
import GameContent from './GameContent';
import ResultAnswer from './ResultAnswer';

const GameMain = React.memo(
  ({state, dispatch}: {state: any; dispatch: React.Dispatch<any>}) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const [showIntro, setShowIntro] = useState(false);
    const [showTopGame, setShowTopGame] = useState(false);
    const [showResultAnswer, setShowResultAnswer] = useState(false);
    const {
      loadingGame,
      background,
      countquestions,
      question,
      countdownStarted,
      statusScoreCurrentQuestion ,
      waitingResult
    } = state;

    useEffect(() => {
      if (loadingGame || waitingResult) {
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
    }, [loadingGame,waitingResult]);

    useEffect(() => {
      if (question) {
        if (countquestions === 1 && loadingGame) {
          setShowTopGame(false);
          setShowIntro(false);
        } else {
          setShowTopGame(true);
          setShowIntro(true);
        }
      }
    }, [question, countquestions, loadingGame]);

    useEffect(() => {
      if (countdownStarted) {
        setShowIntro(false);
      }
    }, [countdownStarted]);

    return (
      <TouchableWithoutFeedback
        onPress={() => dispatch({type: 'SET_OPENMENU', payload: false})}>
        <View style={styles.mainView}>
          <FastImageRes uri={background} />

          {loadingGame && (
            <LoadingGame rotation={rotation} title="Chuẩn bị sẵn sàng!" />
          )}
          {waitingResult && (
            <LoadingGame rotation={rotation} title="" textLoading="Chờ kết quả..."/>
          )}

          {showTopGame && <TopGame state={state} dispatch={dispatch} />}

          {showIntro && !countdownStarted && (
            <IntroQuestion state={state} dispatch={dispatch} />
          )}

          {countdownStarted && (
            <GameContent state={state} dispatch={dispatch} />
          )}
          {!countdownStarted && statusScoreCurrentQuestion !== null && (
            <ResultAnswer state={state} dispatch={dispatch} />
          )}

          <BottomGame state={state} dispatch={dispatch} />
        </View>
      </TouchableWithoutFeedback>
    );
  },
);

export default GameMain;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
