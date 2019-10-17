import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Platform, AsyncStorage } from 'react-native';
import API from './api';

export default async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  try {
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync();
    const previousToken = await AsyncStorage.getItem('PushToken');

    if (previousToken && previousToken === token) {
      return console.log('Token exist');
    }

    if (previousToken && previousToken !== token) {
      await API('/account/unregisterDevice', {
        token: previousToken
      });

      console.log('Token update');
    }

    let query = {
      device_year: Constants.deviceYearClass,
      system_version: Platform.Version,
      token,
      device_platform: ''
    };

    if (Constants.platform.ios) {
      query.device_platform += Constants.platform.ios.model;
    } else {
      query.device_platform += Constants.deviceName;
    }

    const responseSaveToken = await API('/account/registerDevice', query);
    console.log(responseSaveToken);
    if (responseSaveToken) {
      AsyncStorage.setItem('PushToken', token);
    }
  } catch (error) {
    console.log('error register device', error);
  }
}
