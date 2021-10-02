import {AppRegistry} from 'react-native';
import App from './App';
import { name as appName } from './app.json';

var PushNotification = require('react-native-push-notification');



PushNotification.configure({
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

AppRegistry.registerComponent(appName, () => App);
