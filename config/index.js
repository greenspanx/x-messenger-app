import { Platform } from 'react-native';


const awsConfig = {
  bucket: 's3-sydney-x-messenger',
  accessKey: 'AKIASNGFCDTP2BPKR4EJ',
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
  apiHost: 'http://ec2-3-105-229-159.ap-southeast-2.compute.amazonaws.com:3000',
  socketHost: 'http://ec2-13-211-139-50.ap-southeast-2.compute.amazonaws.com:4000',
  awsConfig
};

const getEnvVars = () => {
  if (__DEV__) {
    return development;
  }

  return production;
};

export default getEnvVars();
