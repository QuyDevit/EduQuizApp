import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import IconCorrect from '../../assets/images/icon-correct.svg';
import IconInCorrect from '../../assets/images/icon-incorrect.svg';

const ResultAnswer = React.memo(
  ({state, dispatch}: {state: any; dispatch: React.Dispatch<any>}) => {
    const {statusScoreCurrentQuestion, scoreCurrentQuestion} = state;
    return (
      <View style={styles.container}>
        <Text style={styles.titleResult}>
          {statusScoreCurrentQuestion == 0
            ? 'Không có đáp án'
            : statusScoreCurrentQuestion == 1
            ? 'Câu trả lời đúng'
            : 'Câu trả lời sai'}
        </Text>
        {statusScoreCurrentQuestion != 1 ? (
          <IconInCorrect width={70} height={70} />
        ) : (
          <IconCorrect width={70} height={70} />
        )}

        <View style={styles.scoreWrapper}>
          <Text style={styles.scoreText}>  {statusScoreCurrentQuestion == 0
            ? 'Hãy tập trung hơn'
            : statusScoreCurrentQuestion == 1
            ? `+ ${scoreCurrentQuestion}`
            : 'Không có điểm'}</Text>
        </View>
      </View>
    );
  },
);

export default ResultAnswer;
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
  titleResult: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 1,
    textShadowColor: '#000',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: 'rgb(102,191,57)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#fff',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2,
    textShadowColor: '#000',
  },
  scoreWrapper: {
    marginTop: 20,
    paddingVertical: 8,
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,.6)',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    textShadowColor: '#000',
  },
});
