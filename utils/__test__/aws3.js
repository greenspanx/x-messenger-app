import { RNS3 } from 'react-native-s3-upload';

const file = {
  // `uri` can also be a file system path (i.e. file://)
  uri: "file://d/GitHub/greenspanx/x-messenger-app/assets/images/robot-prod.png",
  name: "image.png",
  type: "image/png"
}

const options = {
  keyPrefix: "photos/",
  bucket: 's3-sydney-x-messenger',
  accessKey: 'AKIASNGFCDTPYPXET7XQ',
  secretKey: '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',
  region: 'ap-southeast-2',
  successActionStatus: 201
}

RNS3.put(file, options).then(response => {
  if (response.status !== 201)
    throw new Error("Failed to upload image to S3");
  console.log(response.body);
  /**
   * {
   *   postResponse: {
   *     bucket: "your-bucket",
   *     etag : "9f620878e06d28774406017480a59fd4",
   *     key: "uploads/image.png",
   *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
   *   }
   * }
   */
});
