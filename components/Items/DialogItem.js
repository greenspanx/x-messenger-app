import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import i18n from 'i18n-js';
import moment from 'moment';
import UserPicture from '../UserPicture';
import { DATE_FORMAT, TIME_FORMAT } from '../../constants/Date';

export default class DialogsItem extends React.Component {
  getTime = timestamp => {
    const currentDate = moment();
    const messageDate = moment(timestamp);

    if (currentDate.isSame(messageDate, 'day')) {
      return messageDate.format(TIME_FORMAT);
    } else if (currentDate.isSame(messageDate, 'week')) {
      return i18n.t(`week_day_short_${messageDate.day()}`);
    } else {
      return messageDate.format(DATE_FORMAT);
    }
  };

  renderText(text) {
    const { message, ownerID } = this.props;
    const senderIsYou = message.sender_id === ownerID;
    const isUnread = !senderIsYou && message.unread && styles.messageUnread;

    return (
      <Text
        style={[styles.message, isUnread]}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {senderIsYou && `${i18n.t('you')}:`} {text}
      </Text>
    );
  }

  renderMessage() {
    const { message } = this.props;
    const hasAttachment = !!message.attachment;

    if (message.text !== '') {
      return this.renderText(message.text);
    } else if (hasAttachment && message.attachment.photo) {
      return this.renderText(i18n.t('photo'));
    }
  }

  render() {
    const { message, onPress, member, unreadCount } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={styles.container}
      >
        <View style={styles.dialogWrapper}>
          <View style={styles.dialogLeft}>
            <UserPicture user={member} hideBorder size={60} />
          </View>
          <View style={styles.dialogRight}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
                {member.first_name} {member.last_name}
              </Text>
              <Text style={styles.dateText}>{this.getTime(message.date)}</Text>
            </View>

            <View style={{ flexDirection: 'row', paddingTop: 3 }}>
              <View style={styles.messageWrapper}>{this.renderMessage()}</View>
              {unreadCount !== 0 && (
                <View style={styles.unreadWrapper}>
                  <Text style={styles.unreadText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16
  },
  dialogItem: {},
  dialogWrapper: {
    marginVertical: 10,
    flexDirection: 'row',
    flex: 1
  },
  dialogLeft: {
    marginRight: 15,
    width: 60,
    height: 60,
    borderRadius: 60,
    overflow: 'hidden'
  },
  dialogRight: {
    paddingVertical: 7,
    flex: 1
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    paddingRight: 10
  },
  dateText: {
    fontSize: 15,
    color: '#999'
  },
  messageWrapper: {
    flex: 1
  },
  message: {
    fontSize: 16,
    color: '#999',
    flex: 1
  },
  messageUnread: {
    fontWeight: '500',
    color: '#000'
  },
  picture: {
    width: 60,
    height: 60
  },
  unreadWrapper: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    backgroundColor: '#4f93e2',
    borderRadius: 20
  },
  unreadText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff'
  }
});
