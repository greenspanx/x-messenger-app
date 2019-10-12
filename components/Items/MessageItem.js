import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
  TouchableWithoutFeedback,
  Image as RNImage
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18n-js';
import moment from 'moment';
import { Image as CacheImage } from '../ImageCache';
import { isSameDay, getPhotoPreview } from '../../utils';
import { DATE_FORMAT, TIME_FORMAT } from '../../constants/Date';
import { navigateToImageViewer } from '../../navigation/NavigationService';
import { MessageUploadProgress } from '../../context/MessageUploaderContext';

export default class MessageItem extends React.Component {
  static defaultProps = {
    onAbortPhotoPress: () => {}
  };

  renderSendingIndicator(sending) {
    if (sending) {
      return (
        <View style={styles.sendingIndicator}>
          <ActivityIndicator color="grey" />
        </View>
      );
    }

    return null;
  }

  renderDate(message, previousMessage) {
    const previousMessageDate = previousMessage && previousMessage.date;
    if (message.preview) {
      return null;
    }

    if (!previousMessage || !isSameDay(message.date, previousMessageDate)) {
      return (
        <Text style={styles.date}>
          {moment(message.date).format(DATE_FORMAT)}
        </Text>
      );
    }

    return null;
  }

  handlePressPhoto = photo => {
    navigateToImageViewer([
      {
        uri: photo.url,
        preview: photo.preview,
        dimensions: {
          width: photo.width,
          height: photo.height
        }
      }
    ]);
  };

  renderPhoto() {
    const { message, isOwner } = this.props;
    const isAndroid = Platform.OS === 'android';
    const imageStyle = [
      styles.messagePhotoSize,
      isOwner ? styles.messageOwnerGradient : styles.messagePhotoRadius
    ];

    return (
      <TouchableWithoutFeedback
        onPress={() => this.handlePressPhoto(message.attachment.photo)}
      >
        <View style={styles.messagePhotoWrapper}>
          {(message.upload || message.photoRaw) && isAndroid ? (
            <RNImage
              source={{ uri: message.attachment.photo.url }}
              style={imageStyle}
            />
          ) : (
            <CacheImage
              {...getPhotoPreview(message.attachment.photo.preview)}
              uri={message.attachment.photo.url}
              style={imageStyle}
            />
          )}

          {message.upload && (
            <View style={{ position: 'absolute' }}>
              <MessageUploadProgress message_id={message._id} />
            </View>
          )}
          <View style={styles.timeInPhotoWrapper}>
            <Text style={styles.timeInPhotoText}>
              {moment(message.date).format(TIME_FORMAT)}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderContent = () => {
    const { message, isOwner } = this.props;
    const hasAttachment = !!message.attachment;

    if (hasAttachment && message.attachment.photo) {
      return this.renderPhoto();
    } else {
      return (
        <>
          <Text
            style={[styles.messageText, isOwner && styles.messageTextOwner]}
          >
            {message.text}
          </Text>
          <Text style={[styles.time, isOwner && styles.timeOwner]}>
            {moment(message.date).format(TIME_FORMAT)}
          </Text>
        </>
      );
    }
  };

  render() {
    const { message, previousMessage, isOwner, lastMessageID } = this.props;
    const isReed = !message.unread && lastMessageID === message._id;

    return (
      <>
        {isOwner ? (
          <View style={[styles.messageWrapper, { alignSelf: 'flex-end' }]}>
            <LinearGradient
              style={[styles.messageOwner, styles.messageOwnerGradient]}
              colors={['#5794d8', '#31baff']}
              start={[0, 1]}
              end={[1, 0]}
            >
              {this.renderContent()}
            </LinearGradient>
            {this.renderSendingIndicator(message.sending)}

            {isReed && (
              <Text style={styles.reedStatusText}>{i18n.t('read')}</Text>
            )}
          </View>
        ) : (
          <View style={[styles.messageWrapper, styles.messageFrom]}>
            {this.renderContent()}
          </View>
        )}

        {this.renderDate(message, previousMessage, lastMessageID)}
      </>
    );
  }
}

const styles = StyleSheet.create({
  messageWrapper: {
    borderRadius: 10,
    margin: 10,
    marginVertical: 7
  },
  messageFrom: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    shadowColor: 'rgb(46, 61, 73)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 1
  },
  messageText: {
    padding: 10,
    fontSize: 16,
    maxWidth: '75%'
  },
  messageOwnerGradient: {
    borderRadius: 10,
    borderBottomRightRadius: 0,
    overflow: 'hidden'
  },
  messageTextOwner: {
    color: '#fff',
    alignSelf: 'flex-end'
  },
  messageOwner: {
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },
  time: {
    alignSelf: 'flex-end',
    color: 'grey',
    paddingBottom: 10,
    fontSize: 12,
    paddingRight: 10
  },
  timeOwner: {
    color: '#fff'
  },
  timeInPhotoWrapper: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    borderRadius: 10
  },
  timeInPhotoText: {
    color: '#fff',
    fontSize: 11
  },
  sendingIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    marginTop: 10,
    left: -30,
    bottom: 5,
    zIndex: 1
  },
  reedStatusText: {
    alignSelf: 'flex-end',
    color: 'grey',
    marginTop: 3,
    fontSize: 12
  },
  date: {
    color: '#b2b2b2',
    textAlign: 'center',
    marginVertical: 5
  },
  messagePhotoWrapper: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  messagePhotoRadius: {
    borderRadius: 10
  },
  messagePhotoSize: {
    width: 230,
    height: 200
  }
});
