import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from '../../App';
import EduQuizGameScreen from '../screens/EduQuizGameScreen';
import PodiumScreen from '../screens/PodiumScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = React.memo(() => {
  return (
    <Stack.Navigator initialRouteName="MainApp">
      <Stack.Screen
        name="MainApp"
        component={App}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EduQuizGameScreen"
        component={EduQuizGameScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="PodiumScreen"
        component={PodiumScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
});

export default RootNavigator;