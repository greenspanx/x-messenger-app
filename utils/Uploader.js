import * as ImageManipulator from 'expo-image-manipulator';
import { RNS3 } from 'react-native-s3-upload';
import extName from 'ext-name';
import { getRandomID } from './index.js';
import Config from '../config';


export function uploadFileAsync(folder, localPath) {
  const fileType = extName(localPath)[0];
  console.log('fileType.ext: ', fileType.ext);
  console.log('fileType.mime: ', fileType.mime);
  console.log('localPath: ', localPath);


  if (!fileType) {
	console.log('no fileType in uploadFileAsync');
    return;
  }

  const file = {
    uri: localPath,
    name: `${getRandomID(12)}.${fileType.ext}`,
    type: fileType.mime
  };
  //keyPrefix: `${folder}/`,
  const options = {
	keyPrefix: `${folder}/`,
  ...Config.awsConfig,
	successActionStatus: 201
  };

  console.log('options: ', options);
  // Returns an object that wraps an XMLHttpRequest instance and behaves
  // like a promise.
  return RNS3.put(file, options);
}

export function getProportionalResize(maxSize, size) {
  let dx, dy;

  size = { ...size };
  if (size.width > maxSize) {
    dx = maxSize / size.width;
    size.width = maxSize;
    size.height = parseInt(size.height * dx, 10);
  }

  if (size.height > maxSize) {
    dy = maxSize / size.height;
    size.height = maxSize;
    size.width = parseInt(size.width * dy, 10);
  }

  return size;
}

export const getPreviewImage = async image => {
  const size = getProportionalResize(5, {
    width: image.width,
    height: image.height
  });

  const preview = await ImageManipulator.manipulateAsync(
    image.uri,
    [{ resize: size }],
    {
      format: 'png',
      base64: true,
      compress: 0.1
    }
  );

  return preview.base64;
};

export const resizeImage = async (image, maxSize) => {
  const size = getProportionalResize(maxSize, {
    width: image.width,
    height: image.height
  });

  const resizedImage = await ImageManipulator.manipulateAsync(image.uri, [
    { resize: size }
  ]);

  return resizedImage;
};
