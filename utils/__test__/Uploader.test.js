import React from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import { RNS3 } from 'react-native-s3-upload';
import extName from 'ext-name';
import { getRandomID } from '../index.js';


import {
  uploadFileAsync,
  getProportionalResize,
  getPreviewImage,
  resizeImage
} from '../Uploader.js';

describe('Uploader test', () => {

  it('works', async () => {
    const folder = 'photos';
    const localPath = "file://d/GitHub/greenspanx/x-messenger-app/assets/images/robot-prod.png";
    uploadFileAsync(folder, localPath).then(response => {
      expect(response.status).toBe(201);
    });
    // expect(1).toBe(1);
  });


})
