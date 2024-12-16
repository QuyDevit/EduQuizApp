import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Host, Portal } from 'react-native-portalize';
import JoinCodeScreen from './src/screens/JoinCodeScreen';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-url-polyfill/auto';

const App = React.memo((): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'light';
  const joinTabBottomSheetRef = React.useRef<any>(null);

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Host>
        <AppNavigator joinTabBottomSheetRef={joinTabBottomSheetRef} />
        <Portal>
          <JoinCodeScreen ref={joinTabBottomSheetRef} />
        </Portal>
      </Host>
    </>
  );
});

export default App;