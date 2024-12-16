import React, {useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {SvgCssUri} from 'react-native-svg/css';
import {FastImageRes} from '../../shared/Reusables';
import AvatarDisplay from './AvatarDisplay';
import {
  AVATAR_URLS,
  ACCESSORY_URLS,
  PLACEHOLDER_AVATAR_URL,
  EYES_BLINK_URL,
} from '../../shared/constants';
import {TText} from '../../themed/themeComponents';
import {useAppSelector} from '../../shared/rdx-hooks';

const ANIMATION_DURATION = 200;
const animateChangeAvatar = (
  changeAvatar: boolean,
  translateYWrapper: Animated.Value,
  translateYAvatar: Animated.Value,
) => {
  const toValue = changeAvatar ? 0 : 500;
  Animated.timing(translateYWrapper, {
    toValue,
    duration: ANIMATION_DURATION,
    useNativeDriver: true,
  }).start();
  Animated.timing(translateYAvatar, {
    toValue: changeAvatar ? 0 : 15,
    duration: ANIMATION_DURATION,
    useNativeDriver: true,
  }).start();
};

const AvatarEditor = React.memo(
  ({state, dispatch}: {state: any; dispatch: React.Dispatch<any>}) => {
    const {
      changeAvatar,
      tabEdit,
      arrAvatar,
      arrAccessory,
      background,
      name,
      connection,
      avatar,
      data,
      accessory,
    } = state;
    const quizSession = useAppSelector(state => state.main.sessionGame);
    const translateYWrapper = useRef(new Animated.Value(100)).current;
    const translateYAvatar = useRef(new Animated.Value(100)).current;
    useEffect(() => {
      animateChangeAvatar(changeAvatar, translateYWrapper, translateYAvatar);
    }, [changeAvatar]);

    const swapAvatar = async (item: string, flag: boolean) => {
      let updatedValue = '';
      if (flag) {
        updatedValue = AVATAR_URLS(item);
        dispatch({
          type: 'SET_AVATAR',
          payload: updatedValue,
        });
      } else {
        updatedValue = ACCESSORY_URLS(item);
        dispatch({
          type: 'SET_ACCESSORY',
          payload: updatedValue,
        });
      }

      await connection.invoke(
        'ChangeAvatar',
        quizSession.pin,
        data.idPlayer,
        flag ? accessory : updatedValue, 
        flag ? updatedValue : avatar, 
      );
    };
    return (
      <TouchableWithoutFeedback
        onPress={() => dispatch({type: 'SET_CHANGE_AVATAR', payload: false})}>
        <View style={styles.background}>
          <FastImageRes uri={background} />
          <View style={styles.viewGame}>
            <AvatarDisplay
              state={state}
              dispatch={dispatch}
              translateYAvatar={translateYAvatar}
            />

            <Animated.View
              style={[
                styles.viewChangeAvatar,
                {
                  transform: [{translateY: translateYWrapper}],
                  display: changeAvatar ? 'flex' : 'none',
                },
              ]}>
              <View style={styles.tabsEdit}>
                <TouchableOpacity
                  style={[
                    styles.tabEditFirst,
                    {
                      backgroundColor:
                        tabEdit === 0 ? 'transparent' : '#f1f1f1',
                    },
                  ]}
                  onPress={() => dispatch({type: 'SET_TAB_EDIT', payload: 0})}>
                  <Text style={styles.textTabEdit}>Nhân vật</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabEditLast,
                    {
                      backgroundColor:
                        tabEdit === 1 ? 'transparent' : '#f1f1f1',
                    },
                  ]}
                  onPress={() => dispatch({type: 'SET_TAB_EDIT', payload: 1})}>
                  <Text style={styles.textTabEdit}>Phụ kiện</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.viewWrapperEdit}>
                <ScrollView
                  contentContainerStyle={styles.viewTabEditAvatar}
                  removeClippedSubviews>
                  {arrAvatar.map((item: string) => (
                    <TouchableOpacity
                      key={`avatar-${item}`}
                      style={[
                        styles.itemAvatar,
                        {display: tabEdit === 0 ? 'flex' : 'none'},
                      ]}
                      onPress={() => swapAvatar(item, true)}>
                      <SvgCssUri
                        width="100%"
                        height="100%"
                        uri={AVATAR_URLS(item)}
                        style={styles.viewAvatarEdit}
                      />
                      <View style={styles.viewEyes}>
                        <FastImageRes uri={EYES_BLINK_URL} />
                      </View>
                    </TouchableOpacity>
                  ))}

                  {arrAccessory.map((item: string) => (
                    <TouchableOpacity
                      key={`accessory-${item}`}
                      style={[
                        styles.itemAvatar,
                        {display: tabEdit === 1 ? 'flex' : 'none'},
                      ]}
                      onPress={() => swapAvatar(item, false)}>
                      <SvgCssUri
                        width="100%"
                        height="100%"
                        uri={PLACEHOLDER_AVATAR_URL}
                        style={styles.viewAvatarEdit}
                      />
                      <SvgCssUri
                        width="100%"
                        height="100%"
                        uri={ACCESSORY_URLS(item)}
                        style={styles.viewAccessory}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.buttonSubmib}
                  onPress={() =>
                    dispatch({type: 'SET_CHANGE_AVATAR', payload: false})
                  }>
                  <TText style={styles.textSubmib}>Xong</TText>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <View
              style={{
                display: changeAvatar ? 'none' : 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TText style={styles.textName}>{name}</TText>
              <TText style={styles.textNote}>
                Bạn đang tham gia! Xem tên của bạn trên màn hình?
              </TText>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  },
);

export default AvatarEditor;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    position: 'relative',
    height: '100%',
    width: '100%',
    zIndex: 0,
  },
  viewGame: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
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
  viewAvatarEdit: {
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
  viewChangeAvatar: {
    backgroundColor: '#fff',
    height: 540,
    width: '100%',
    marginBottom: 60,
  },
  textTabEdit: {
    color: '#333',
    fontSize: 15,
    fontWeight: 500,
  },
  tabsEdit: {
    marginTop: 12,
    height: 42,
    width: '95%',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  tabEditFirst: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderEndWidth: 0,
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  tabEditLast: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  viewWrapperEdit: {
    flex: 1,
    width: '95%',
    height: '100%',
    alignSelf: 'center',
    marginTop: 16,
  },
  viewTabEditAvatar: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemAvatar: {
    height: 110,
    width: '31%',
    margin: 4,
    backgroundColor: '#f3f2f2',
    borderRadius: 6,
  },
  textName: {
    marginTop: 16,
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    textShadowColor: '#333',
  },
  textNote: {
    marginTop: 16,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
    textShadowColor: '#333',
    textAlign: 'center',
  },
  buttonSubmib: {
    backgroundColor: 'transparent',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    borderRadius: 4,
  },
  textSubmib: {
    color: '#333',
    fontSize: 18,
    fontWeight: 500,
    textAlign: 'center',
  },
});
