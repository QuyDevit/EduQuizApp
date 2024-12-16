import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import LibraryScreen from '../screens/LibraryScreen';
import {FastImageRes} from '../shared/Reusables';
import {TText} from '../themed/themeComponents';
import { ICON_MENU } from '../shared/constants';

const Tab = createBottomTabNavigator();

interface AppNavigatorProps {
  joinTabBottomSheetRef: React.RefObject<any>;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ joinTabBottomSheetRef }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
        tabBarActiveTintColor: '#24459B',
        tabBarInactiveTintColor: '#757575',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <IonIcon name="home-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <IonIcon name="globe-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Khám phá',
        }}
      />
      <Tab.Screen
        name="JoinCode"
        component={() => null}
        options={{
          tabBarLabel: 'Tham gia',
          tabBarButton: props => (
            <TouchableOpacity
              {...props}
              onPress={() => joinTabBottomSheetRef.current?.open()}
              style={{
                width: 50,
                height: 50,
                borderRadius: 4,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 30,
                position: 'absolute',
                bottom: '-20%',
                left: '50%',
                transform: [{translateX: -25}],
                elevation: 4,
              }}>
              <View
                style={{
                  width: 45,
                  height: 45,
                  backgroundColor: '#fff',
                  borderRadius: 2,
                }}>
                <FastImageRes
                  uri={
                    ICON_MENU
                  }
                />
              </View>
              <TText
                style={{
                  fontSize: 11,
                  marginTop: 5,
                  color: '#757575',
                  position: 'absolute',
                  bottom: '-36%',
                  left: 0,
                  fontWeight: 500,
                }}>
                {'Tham gia'}
              </TText>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <IonIcon name="library-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Thư viện',
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <IonIcon name="settings-outline" color={color} size={size} />
          ),
          tabBarLabel: 'Cài đặt',
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;