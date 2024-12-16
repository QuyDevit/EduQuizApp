import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {SvgCssUri} from 'react-native-svg/css';
import {FastImageRes} from '../../shared/Reusables';
import {BASE_URL} from '../../api/config';

const BottomGame = React.memo(
  ({state, dispatch}: {state: any; dispatch: React.Dispatch<any>}) => {
    const {avatar, accessory, question,score,name} = state;
    return (
      <View style={[styles.viewBottom]}>
        <View style={styles.viewWrapper}>
          {question.quizoption.isShowAvatar && (
            <View style={styles.viewAvatarWrapper}>
              <SvgCssUri
                width="100%"
                height="100%"
                uri={
                  avatar
                }
                style={styles.viewAvatar}
              />
              <SvgCssUri
                width="100%"
                height="100%"
                uri={
                  accessory
                }
                style={styles.viewAccessory}
              />
              <View style={styles.viewEyes}>
                <FastImageRes uri={`${BASE_URL}/src/img/eyes-blink.gif`} />
              </View>
            </View>
          )}

          <Text style={styles.textName}>{name}</Text>
        </View>
        <View style={styles.viewScore}>
          <View style={styles.viewScoreWrapper}>
            <Text style={styles.textScore}>{score}</Text>
          </View>
        </View>
      </View>
    );
  },
);

export default BottomGame;

const styles = StyleSheet.create({
  viewBottom: {
    display: 'flex',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 0,
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(255, 255, 255);',
    opacity: 0.8,
  },
  viewWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAvatarWrapper: {
    width: 58,
    height: 58,
    marginLeft: 10,
    marginBottom: 8,
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
  textName: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  viewScore: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewScoreWrapper: {
    height: '72%',
    width: 'auto',
    opacity: 0.98,
    backgroundColor: '#000',
    marginRight: 18,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    minWidth: 90,
  },
  textScore: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
