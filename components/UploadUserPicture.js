import React from 'react';
import { Alert } from 'react-native';
import i18n from 'i18n-js';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import UserPicture from '../components/UserPicture';
import { choosePhoto, takePhoto } from '../utils/ImagePicker';
import API from '../api';
import {
  uploadFileAsync,
  getPreviewImage,
  resizeImage
} from '../utils/Uploader';

@connectActionSheet
export default class UploadUserPicture extends React.Component {
  state = {
    isUploadPhoto: false,
    rawPictureUri: null
  };

  handlePressPhoto = () => {
    const { user } = this.props;
    const hasUserPicture = user.picture && user.picture.url;

    const options = [
      i18n.t('cancel'),
      i18n.t('choose_photo'),
      i18n.t('take_photo'),
      ...(hasUserPicture ? [i18n.t('remove_photo')] : [])
    ];

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        ...(hasUserPicture && { destructiveButtonIndex: 3 })
      },
      buttonIndex => {
        const options = {
          allowsEditing: true,
          aspect: [4, 3]
        };

        if (buttonIndex === 1) {
          choosePhoto(this.startUploadPhoto, options);
        } else if (buttonIndex === 2) {
          takePhoto(this.startUploadPhoto, options);
        } else if (buttonIndex === 3) {
          this.removePicture();
        }
      }
    );
  };

  removePicture = () => {
    API('/account/removePicture')
      .then(() => {
        this.props.onSave('profile', { picture: {} });
      })
      .catch(err => {
        console.log(err);
        Alert.alert(i18n.t('error'), JSON.stringify(err));
      });
  };

  startUploadPhoto = async photo => {
    try {
      const resizedPhoto = await resizeImage(photo, 100);
      const preview = await getPreviewImage(resizedPhoto);

      this.setState({
        rawPictureUri: resizedPhoto.uri,
        isUploadPhoto: true
      });
	  console.log('resizedPhoto.uri: ', resizedPhoto.uri);

      const response = await uploadFileAsync('photo', resizedPhoto.uri);

      if (response.status !== 201) {
		console.log(response.body);
        throw new Error('Failed to upload image to S3');
      }

      const photoURL = response.body.postResponse.location;

      const picture = {
        url: photoURL,
        width: resizedPhoto.width,
        height: resizedPhoto.height,
        preview
      };

      await API('/account/changePicture', { ...picture });

      this.setState({
        isUploadPhoto: false,
        rawPictureUri: null
      });
      this.props.onSave('profile', { picture });
    } catch (error) {
      console.log(error);
      this.setState({
        isUploadPhoto: false,
        rawPictureUri: null
      });

      Alert.alert(
        i18n.t('error'),
        'Failed to upload image to S3, Please check your AWS configuration in the folder config'
      );
    }
  };

  render() {
    const { isUploadPhoto, rawPictureUri } = this.state;
    const { size, user } = this.props;

    const picture =
      user.picture && user.picture.url
        ? user.picture
        : rawPictureUri && { url: rawPictureUri };

    return (
      <UserPicture
        onPress={this.handlePressPhoto}
        isLoading={isUploadPhoto}
        chooseOverlay
        user={{
          ...user,
          picture
        }}
        size={size}
      />
    );
  }
}
