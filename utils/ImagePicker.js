import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import i18n from 'i18n-js';

export const choosePhoto = async (onPicked, options = {}) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if (status === 'granted') {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      ...options
    });

    if (!pickerResult.cancelled) {
      onPicked(pickerResult);
    }
  }
};

export const takePhoto = async (onPicked, options = {}) => {
  const { status: statusCameraRoll } = await Permissions.askAsync(
    Permissions.CAMERA_ROLL
  );
  const { status: statusCamera } = await Permissions.askAsync(
    Permissions.CAMERA
  );

  try {
    if (statusCameraRoll === 'granted' && statusCamera === 'granted') {
      const pickerResult = await ImagePicker.launchCameraAsync(options);

      if (!pickerResult.cancelled) {
        onPicked(pickerResult);
      }
    }
  } catch (error) {
    console.log(error);
    Alert.alert(
      i18n.t('error'),
      'The simulator does not support the camera, run this function on a real device to work'
    );
  }
};
