/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import DefaultComponent from './src/components/DefaultComponent';

AppRegistry.registerComponent(appName, () => DefaultComponent);
