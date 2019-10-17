import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import i18n from 'i18n-js';

// Permissions.CAMERA_ROLL --  READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE
export const choosePhoto = async (onPicked, options = {}) => {
  // granted, denied
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if (status === 'granted') {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      ...options
    });

    if (!pickerResult.cancelled) {
      return onPicked(pickerResult);
    }
  }
};

export const takePhoto = async (onPicked, options = {}) => {
  // Permissions.CAMERA_ROLL -- The permission type for reading or writing to the camera roll.
  // { status: statusCameraRoll } -- destructure and assignment
  const { status: statusCameraRoll } = await Permissions.askAsync(
    Permissions.CAMERA_ROLL
  );
  // Permissions.CAMERA -- The permission type for photo and video taking.
  const { status: statusCamera } = await Permissions.askAsync(
    Permissions.CAMERA
  );

  // utilise try{}catch{} to flaten if else / callback hell
  try {
    if (statusCameraRoll === 'granted' && statusCamera === 'granted') {
      const pickerResult = await ImagePicker.launchCameraAsync(options);

      if (!pickerResult.cancelled) {
        return onPicked(pickerResult);
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
