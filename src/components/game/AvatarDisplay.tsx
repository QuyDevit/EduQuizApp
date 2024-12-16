import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {SvgCssUri} from 'react-native-svg/css';
import {FastImageRes} from '../../shared/Reusables';
import IconEdit from '../../assets/images/icon-edit.svg';
import {BASE_URL} from '../../api/config';

const AvatarDisplay = React.memo(
  ({
    state,
    dispatch,
    translateYAvatar,
  }: {
    state: any;
    dispatch: React.Dispatch<any>;
    translateYAvatar: any;
  }) => {
    const {avatar, accessory, changeAvatar} = state;
    return (
      <TouchableOpacity
        style={[
          styles.viewGameContent,
          {
            backgroundColor: changeAvatar ? 'transparent' : '#1d43a5',
            width: changeAvatar ? '40%' : '32%',
            height: changeAvatar ? 150 : 120,
            transform: [{translateY: translateYAvatar}],
          },
        ]}
        onPress={() => dispatch({type: 'SET_CHANGE_AVATAR', payload: true})}>
        <SvgCssUri
          width="100%"
          height="100%"
          uri={avatar}
          style={styles.viewAvatar}
        />
        <SvgCssUri
          width="100%"
          height="100%"
          uri={accessory}
          style={styles.viewAccessory}
        />
        <View style={styles.viewEyes}>
          <FastImageRes uri={`${BASE_URL}/src/img/eyes-blink.gif`} />
        </View>
        <View
          style={[styles.iconEdit, {display: changeAvatar ? 'none' : 'flex'}]}>
          <IconEdit width={35} height={35} />
        </View>
      </TouchableOpacity>
    );
  },
);

export default AvatarDisplay;
const styles = StyleSheet.create({
  viewGameContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
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
  iconEdit: {
    position: 'absolute',
    zIndex: 4,
    top: -15,
    right: -15,
    height: 35,
    width: 35,
    backgroundColor: '#fff',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
