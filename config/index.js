import { Platform } from 'react-native';

// arn:aws:iam::165769518303:user/messenger001
const awsConfig = {
  bucket: 's3-sydney-x-messenger',
  accessKey: 'AKIASNGFCDTPYPXET7XQ',
  secretKey: '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',
  region: 'ap-southeast-2'
};

const development = {
  apiHost:
    Platform.OS === 'android'
      ? 'http://3.105.229.159:3000'
      : 'http://ec2-3-105-229-159.ap-southeast-2.compute.amazonaws.com:3000',
  socketHost:
    Platform.OS === 'android'
      ? 'http://13.211.139.50:4000'
      : 'http://ec2-13-211-139-50.ap-southeast-2.compute.amazonaws.com:4000',
  awsConfig
};

const production = {
  // apiHost: 'http://3.105.229.159:3000',
  apiHost: 'http://ec2-3-105-229-159.ap-southeast-2.compute.amazonaws.com:3000',
  socketHost: 'http://ec2-13-211-139-50.ap-southeast-2.compute.amazonaws.com:4000',
  awsConfig
};

const getEnvVars = () => {
  // __DEV__ global variable
  // If you are running your app in the iOS Simulator or Android
  // emulator __DEV__ will be set to true.
  if (__DEV__) {
    return development;
  }

  return production;
};

export default getEnvVars();
