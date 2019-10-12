import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import i18n from 'i18n-js';
import UploadPhotoProgress from '../components/UploadPhotoProgress';

import {
  uploadFileAsync,
  getPreviewImage,
  resizeImage
} from '../utils/Uploader';
import { getRandomID } from '../utils';

import {
  appendMessage,
  removeMessage,
  sendMessage
} from '../redux/actions/ConversationActions';

const initialState = {
  activeUploads: {}
};

export const MessageUploaderContext = React.createContext(initialState);

@connect(
  ({ user }) => ({ user }),
  {
    appendMessage,
    removeMessage,
    sendMessage
  }
)
export class MessageUploaderProvider extends React.Component {
  state = initialState;

  componentDidMount() {
    if (this.props.refUploader) {
      this.props.refUploader({
        uploadPhoto: this.uploadPhoto
      });
    }
  }

  uploadPhoto = async (recipient, rawPhoto) => {
    const { user } = this.props;
    const randomMessageID = getRandomID(10);

    const resizedPhoto = await resizeImage(rawPhoto, 1000);
    const preview = await getPreviewImage(resizedPhoto);

    const photo = {
      url: resizedPhoto.uri,
      preview,
      width: resizedPhoto.width,
      height: resizedPhoto.height
    };

    this.props.appendMessage(recipient._id, {
      _id: randomMessageID,
      recipient_id: recipient._id,
      sender_id: user._id,
      text: '',
      attachment: { photo },
      date: +new Date(),
      unread: 1,
      upload: true
    });

    const upload = uploadFileAsync('photos', resizedPhoto.uri);

    this.setState(prevState => ({
      activeUploads: {
        ...prevState.activeUploads,
        [randomMessageID]: {
          percent: 0,
          abort: () => {
            upload.abort();
            this.props.removeMessage(recipient._id, randomMessageID);
            this.removeUploader(randomMessageID);
          }
        }
      }
    }));

    upload.progress(e => {
      this.setState(prevState => ({
        activeUploads: {
          ...prevState.activeUploads,
          [randomMessageID]: {
            ...prevState.activeUploads[randomMessageID],
            percent: Math.floor(e.percent * 100)
          }
        }
      }));
    });

    upload.then(response => {
      if (response.status !== 201) {
        throw new Error('Failed to upload image to S3');
      }

      const photoURL = response.body.postResponse.location;

      this.props.removeMessage(recipient._id, randomMessageID);
      this.props.sendMessage(recipient._id, {
        recipient,
        text: '',
        attachment: {
          photo: { ...photo, url: photoURL }
        },
        photoRaw: photo
      });

      this.removeUploader(randomMessageID);
    });

    upload.catch(err => {
      this.props.removeMessage(recipient._id, randomMessageID);
      Alert.alert(i18n.t('error'), i18n.t('error_upload_photo'));
      console.log(err);
    });
  };

  removeUploader = id => {
    const newActiveUploads = { ...this.state.activeUploads };
    delete newActiveUploads[id];
    this.setState({ activeUploads: newActiveUploads });
  };

  render() {
    return (
      <MessageUploaderContext.Provider value={this.state}>
        {this.props.children}
      </MessageUploaderContext.Provider>
    );
  }
}

export const MessageUploadProgress = ({ message_id }) => (
  <MessageUploaderContext.Consumer>
    {({ activeUploads }) => {
      const currentUpload = activeUploads[message_id];

      if (!currentUpload) {
        return null;
      }

      return (
        <UploadPhotoProgress
          size={50}
          percent={currentUpload.percent || 0}
          onAbortPress={currentUpload.abort}
        />
      );
    }}
  </MessageUploaderContext.Consumer>
);
