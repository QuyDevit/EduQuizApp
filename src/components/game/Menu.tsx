import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import LeaveIcon from '../../assets/images/leave-icon.svg';
import RefreshIcon from '../../assets/images/refresh-icon.svg';

const Menu = ({state, dispatch}: {state: any; dispatch: React.Dispatch<any>}) => {
    const {openmenu} = state;
  const menuAnimation = React.useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const newMenuVisible = !openmenu;
    dispatch({type: 'SET_OPENMENU', payload: newMenuVisible});

    Animated.timing(menuAnimation, {
      toValue: newMenuVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() =>{
    if (!openmenu) {
        Animated.timing(menuAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
  },[openmenu])
  const menuStyle = {
    opacity: menuAnimation,
    transform: [
      {
        translateY: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-40, 0],
        }),
      },
    ],
  };

  return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableArea} onPress={toggleMenu}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
        {openmenu && (
          <Animated.View style={[styles.menu, menuStyle]}>
            <TouchableOpacity style={styles.menuItem}>
              <RefreshIcon width={20} height={20} style={{marginLeft:-12}}/>
              <Text style={styles.textMenuItem}>Tải lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() =>dispatch({type: 'SET_CLOSE', payload: true})}>
              <LeaveIcon width={24} height={24} />
              <Text style={styles.textMenuItem}>Rời khỏi</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: 42,
    height: 42,
    borderRadius: 45 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  touchableArea: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menu: {
    position: 'absolute',
    top: 45,
    right: 0,
    width: 110,
    borderRadius: 4,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textMenuItem: {
    marginBottom: 8,
    fontSize: 16,
    marginLeft:4
  },
});

export default Menu;
