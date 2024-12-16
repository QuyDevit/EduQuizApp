import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../shared/store';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';
import RootNavigator from '../navigation/RootNavigator';

const DefaultComponent = React.memo(() => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <FlashMessage position="top" />
    </Provider>
  );
});

export default DefaultComponent;