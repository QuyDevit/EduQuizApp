import React from 'react';
import {View, Animated, StyleSheet, Text} from 'react-native';
import Loader from '../../assets/images/loader.svg';

interface LoadingGameProps {
  rotation: Animated.Value;
  title?: string;
  textLoading?: string;
}

const LoadingGame: React.FC<LoadingGameProps> = ({
  rotation,
  title = '',
  textLoading = 'Đang tải...',
}) => {
  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.overlay}>
      <Text style={styles.textTitle}>{title}</Text>
      <Animated.View style={{transform: [{rotate}]}}>
        <Loader width={70} height={70} />
      </Animated.View>
      <Text style={styles.textLoading}>{textLoading}</Text>
    </View>
  );
};

export default LoadingGame;
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  textTitle: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    textShadowColor: '#333',
    marginBottom: 14,
  },
  textLoading: {
    marginTop: 10,
    color: '#fff',
    zIndex: 2,
    fontSize: 22,
    fontWeight: 'bold',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
    textShadowColor: '#333',
  },
});
