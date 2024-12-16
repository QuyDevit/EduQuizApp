import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Loader from '../assets/images/loader.svg';

interface LoadingOverlayProps {
  rotation: Animated.Value;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ rotation }) => {
  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.overlay}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Loader width={100} height={100} />
      </Animated.View>
    </View>
  );
};

export default LoadingOverlay;
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
