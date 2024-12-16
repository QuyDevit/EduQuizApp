import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {ICON_QUESTION,TEXT_TYPE_QUESTION} from '../../shared/constants';
import {FastImageRes} from '../../shared/Reusables';
import Menu from './Menu';

const TopGame = React.memo(
  ({state, dispatch}: {state: any; dispatch: React.Dispatch<any>}) => {
    const {question,countquestions} = state;
    return (
      <View style={styles.viewTop}>
        <View style={styles.viewCircle}>
          <Text style={styles.textCounter}>{countquestions}</Text>
        </View>
        <View style={styles.viewHeaderQuestion}>
            <View style={styles.iconWrapper}>
                <FastImageRes uri={ICON_QUESTION(`${question.question.typeQuestion}`)}/>
            </View>
            <Text style={styles.textTypeQuestion}>{TEXT_TYPE_QUESTION(`${question.question.typeQuestion}`)}</Text>
        </View>
        <Menu state={state} dispatch={dispatch}/>
      </View>
    );
  },
);

export default TopGame;

const styles = StyleSheet.create({
  viewTop: {
    display: 'flex',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 10,
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  viewCircle: {
    display: 'flex',
    width: 42,
    height: 42,
    borderRadius: 45/2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewHeaderQuestion: {
    height:42,
    display: 'flex',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
    paddingHorizontal: 16,
    borderRadius: 42/2,
  },
  textTypeQuestion:{
    fontSize:18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  iconWrapper: {
    width: 35, 
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCounter: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
