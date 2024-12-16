import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {FastImageRes} from '../../shared/Reusables';
import {BASE_URL} from '../../api/config';
import IconAns1 from '../../assets/images/ans1-icon.svg';
import IconAns2 from '../../assets/images/ans2-icon.svg';
import IconAns3 from '../../assets/images/ans3-icon.svg';
import IconAns4 from '../../assets/images/ans4-icon.svg';
import IconAns5 from '../../assets/images/ans5-icon.svg';
import IconAns6 from '../../assets/images/ans6-icon.svg';
import {useAppSelector} from '../../shared/rdx-hooks';

const darkenColor = (color, factor = 0.1) => {
  const [r, g, b] = color
    .match(/\d+/g)
    .map(num => Math.max(0, Math.min(255, parseInt(num) - factor * 255)));
  return `rgb(${r}, ${g}, ${b})`;
};
const colors = [
  'rgb(226, 27, 60)',
  'rgb(19, 104, 206)',
  'rgb(216, 158, 0)',
  'rgb(38, 137, 12)',
  'rgb(10, 163, 163)',
  'rgb(134, 76, 191)',
];
const icons = [IconAns1, IconAns2, IconAns3, IconAns4, IconAns5, IconAns6];

const revealSequences = {
  9: [2, 6, 0, 3, 8, 1, 4, 7, 5], // 3x3
  25: [
    23, 1, 12, 19, 7, 8, 0, 24, 17, 15, 11, 4, 20, 2, 9, 13, 5, 21, 6, 10, 14,
    3, 16, 18, 22,
  ], // 5x5
  64: [
    37, 5, 47, 12, 56, 0, 24, 19, 30, 35, 48, 1, 57, 4, 62, 52, 38, 10, 41, 63,
    14, 33, 45, 29, 3, 27, 31, 44, 20, 7, 15, 42, 2, 39, 53, 28, 34, 59, 13, 50,
    55, 8, 32, 18, 54, 11, 43, 60, 40, 16, 6, 9, 58, 61, 46, 22, 26, 36, 49, 17,
    21, 25, 51, 23,
  ], // 8x8
};

const getGridItemStyle = (gridSize: number) => {
  const width = `${100 / gridSize}%`;
  const height = `${100 / gridSize}%`;

  return {
    width: width,
    height: height,
    backgroundColor: '#1d43a5',
  };
};

const GameContent = React.memo(
  ({state, dispatch}: {state: any; dispatch: React.Dispatch<any>}) => {
    const {question, connection, data} = state;
    const quizSession = useAppSelector(state => state.main.sessionGame);
    const time = question.question.time || 10;

    const totalGridSize = parseInt(question.question.imageEffect, 10) || 3;
    const totalTransitionTime = time * 1000 || 10000;
    const progressWidth = useRef(new Animated.Value(0)).current;
    const textPosition = useRef(new Animated.Value(0)).current;
    const [inputValue, setInputValue] = useState('');
    const [startTime, setStartTime] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);

    const [timeLeft, setTimeLeft] = useState(time);
    const [gridItems, setGridItems] = useState(
      Array(totalGridSize * totalGridSize).fill({opacity: 1, revealed: false}),
    );

    const toggleSelect = (id: number) => {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
      );
    };

    useEffect(() => {
      setStartTime(Date.now());
    }, [question]);

    const handleSubmitMultiAnswer = async () => {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;
      try {
        await connection.invoke(
          'SubmitMultiAnswer',
          data.idPlayer,
          selectedIds,
          question.question.id,
          quizSession.pin,
          timeTaken,
        );
        setSelectedIds([]);
        dispatch({type: 'SET_COUNTDOWN_STARTED', payload: false});
        dispatch({type: 'SET_WAITINGRESULT', payload: true});
      } catch (err) {
        console.error('Lỗi khi nộp đáp án', err);
      }
    };
    const handleSubmit = async () => {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;
      try {
        await connection.invoke(
          'SubmitInputAnswer',
          data.idPlayer,
          inputValue,
          question.question.id,
          quizSession.pin,
          timeTaken,
        );
        dispatch({type: 'SET_COUNTDOWN_STARTED', payload: false});
        dispatch({type: 'SET_WAITINGRESULT', payload: true});
      } catch (err) {
        console.error('Lỗi khi nộp đáp án', err);
      }
    };
    const sendAnswer = async (choiceId: number) => {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;
      try {
        await connection.invoke(
          'SubmitAnswer',
          data.idPlayer,
          choiceId,
          question.question.id,
          quizSession.pin,
          timeTaken,
        );
        dispatch({type: 'SET_COUNTDOWN_STARTED', payload: false});
        dispatch({type: 'SET_WAITINGRESULT', payload: true});
      } catch (err) {
        console.error('Lỗi khi nộp đáp án', err);
      }
    };

    useEffect(() => {
      const countdownInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(countdownInterval);
            return 0;
          }
        });
      }, 1000);

      Animated.timing(progressWidth, {
        toValue: 1,
        duration: totalTransitionTime,
        useNativeDriver: false,
      }).start();

      Animated.timing(textPosition, {
        toValue: 1,
        duration: totalTransitionTime,
        useNativeDriver: false,
      }).start();
      if (
        question.question.imageEffect !== '' &&
        question.question.imageEffect !== '0'
      ) {
        applyGridRevealEffect(totalGridSize, totalTransitionTime);
      }

      return () => clearInterval(countdownInterval);
    }, []);

    const applyGridRevealEffect = (
      gridSize: number,
      totalTransitionTime: number,
    ) => {
      const totalItems = gridSize * gridSize;
      const revealOrder = revealSequences[totalItems];

      revealOrder.forEach((index, sequencePosition) => {
        setTimeout(() => {
          setGridItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = {opacity: 0, revealed: true};
            return updatedItems;
          });
        }, sequencePosition * (totalTransitionTime / totalItems));
      });
    };
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap
      }
      return newArray;
    };
    

    return (
      <View style={styles.container}>
        <View style={styles.imageQuestion}>
          {question.question.imageEffect !== '' &&
            question.question.imageEffect !== '0' && (
              <View style={styles.hiddenOverlay}>
                {gridItems.map((item, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      getGridItemStyle(totalGridSize),
                      {
                        opacity: item.opacity,
                        backgroundColor: item.revealed
                          ? 'transparent'
                          : '#1d43a5',
                      },
                    ]}
                  />
                ))}
              </View>
            )}

          {question.quizoption.isShowQAndA && question.question.image != '' && (
            <FastImageRes uri={`${BASE_URL}${question.question.image}`} />
          )}
        </View>
        <View style={styles.wrapperContent}>
          <View style={styles.wrapperQuestion}>
            <Text style={styles.titleQuestion}>
              {question.question.questionText}
            </Text>
          </View>
          {question.question.typeQuestion === 'input_answer' && (
            <TouchableOpacity
              style={styles.btnSubmitAnswer}
              onPress={handleSubmit}>
              <Text style={styles.textSubmit}>Nộp đáp án</Text>
            </TouchableOpacity>
          )}
          {question.question.typeQuestion === 'quiz' &&
            question.question.typeAnswer === 2 && (
              <TouchableOpacity
                style={styles.btnSubmitAnswer}
                onPress={handleSubmitMultiAnswer}>
                <Text style={styles.textSubmit}>Nộp đáp án</Text>
              </TouchableOpacity>
            )}
          <View style={styles.wrapperAnswer}>
            {question.question.typeQuestion !== 'input_answer' ? (
              (() => {
                const choices = question.question.isRandomAnswer
                  ? shuffleArray(question.question.choices)
                  : question.question.choices;

                return choices.map((answer, index) => {
                  const IconComponent = icons[index % icons.length];
                  const isSelected = selectedIds.includes(answer.id);
                  const scaleValue = isSelected ? 0.9 : 1;
                  const handleAnswerPress = () => {
                    if (question.question.typeAnswer === 1) {
                      sendAnswer(answer.id);
                    } else {
                      toggleSelect(answer.id);
                    }
                  };

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.answerCard,
                        {
                          backgroundColor: colors[index % colors.length],
                          borderColor: darkenColor(
                            colors[index % colors.length],
                          ),
                          transform: [{scale: scaleValue}],
                          ...(question.question.typeQuestion ===
                            'true_false' && {
                            height: 90,
                          }),
                        },
                      ]}
                      onPress={handleAnswerPress}>
                      <View style={styles.iconAnswer}>
                        <IconComponent width={20} height={20} />
                      </View>
                      <Text style={styles.textAnswer}>{answer.answer}</Text>
                    </TouchableOpacity>
                  );
                });
              })()
            ) : (
              <TextInput
                style={styles.inputAnswer}
                onChangeText={text => setInputValue(text)}
                value={inputValue}
                placeholder="Nhập câu trả lời"
                onSubmitEditing={handleSubmit}
              />
            )}
          </View>
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressView,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['100%', '0%'],
                  }),
                },
              ]}
            />
            <Animated.Text
              style={[
                styles.countdownText,
                {
                  right: textPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}>
              {timeLeft}
            </Animated.Text>
          </View>
        </View>
      </View>
    );
  },
);

export default GameContent;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '86%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginTop: 50,
  },
  hiddenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageQuestion: {
    marginTop: 150,
    height: 210,
    maxHeight: 220,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  wrapperContent: {
    marginTop: 'auto',
    width: '92%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperQuestion: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  titleQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  wrapperAnswer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 10,
    paddingVertical: 12,
    gap: 8,
    justifyContent: 'space-between',
  },
  answerCard: {
    width: '48.5%',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 3,
    borderStartWidth: 1,
    borderTopWidth: 0,
    borderEndWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignContent: 'center',
  },
  textAnswer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  iconAnswer: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  progressContainer: {
    position: 'relative',
    width: '100%',
    height: 16,
  },
  progressView: {
    height: 16,
    backgroundColor: '#1d43a5',
    borderRadius: 16 / 2,
    width: '100%',
    alignSelf: 'flex-start',
  },
  countdownText: {
    position: 'absolute',
    top: -4,
    marginRight: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  btnSubmitAnswer: {
    backgroundColor: '#1d43a5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    borderWidth: 3,
    borderStartWidth: 1,
    borderTopWidth: 0,
    borderEndWidth: 2,
    borderColor: '#13399b',
  },
  textSubmit: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputAnswer: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 6,
    width: '100%',
  },
});
