import React from 'react';
import {
  Animated,
  Easing,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import i18n from 'i18n-js';
import { Viewport } from '../utils';
import UserPicture from '../components/UserPicture';
import { navigateToConversation } from '../navigation/NavigationService';

export default class TopBarNotification extends React.Component {
  state = {
    isVisible: false,
    notification: null,
    notifications: []
  };

  offset = new Animated.Value(-100);
  show = newNotification => {
    const { notifications, isVisible } = this.state;
    notifications.push(newNotification);
    this.setState({ isVisible: true, notifications });

    if (!isVisible) {
      this.startAnimation(newNotification);
    }
  };

  startAnimation(notification) {
    this.setState({ notification });

    Animated.sequence([
      Animated.delay(100),
      Animated.spring(this.offset, {
        tension: -5,
        toValue: 0,
        useNativeDriver: true
      }),
      Animated.delay(400),
      Animated.timing(this.offset, {
        duration: 500,
        toValue: -100,
        easing: Easing.easeInOut,
        useNativeDriver: true
      })
    ]).start(() => {
      const { notifications, isVisible } = this.state;

      if (!isVisible) return;

      notifications.splice(0, 1);

      let newState = { notifications };
      if (notifications.length < 1) {
        newState.isVisible = false;
        newState.notification = null;
      } else {
        this.startAnimation(notifications[0]);
      }

      this.setState(newState);
    });
  }

  handlePressMessage = ({ sender, message }) => () => {
    this.setState({
      isVisible: false,
      notification: null,
      notifications: []
    });

    navigateToConversation(sender, message);
  };

  getMessageText = message => {
    const hasAttachment = message.attachment;

    if (hasAttachment && message.attachment.photo) {
      return i18n.t('photo');
    }

    return message.text;
  };

  render() {
    const { isVisible, notification } = this.state;
    const notificationTransform = { transform: [{ translateY: this.offset }] };

    if (isVisible && notification) {
      return (
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1 }}>
            <Animated.View style={[styles.notification, notificationTransform]}>
              <TouchableOpacity
                style={styles.wrapper}
                onPress={this.handlePressMessage(notification)}
              >
                <View style={styles.picture}>
                  <UserPicture
                    user={notification.sender}
                    hideBorder
                    size={35}
                  />
                </View>
                <View>
                  <Text
                    style={styles.name}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {notification.sender.first_name}{' '}
                    {notification.sender.last_name}
                  </Text>
                  <Text
                    style={styles.message}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {this.getMessageText(notification.message)}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </SafeAreaView>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100,
    paddingTop: Platform.OS === 'android' ? 25 : 15
  },
  notification: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.19,
    shadowRadius: 10,
    elevation: 10
  },

  wrapper: {
    flexDirection: 'row'
  },
  picture: {
    marginRight: 10
  },
  name: {
    maxWidth: Viewport.width - 150,
    fontSize: 16,
    fontWeight: '500'
  },
  message: {
    maxWidth: Viewport.width - 100,
    fontSize: 13
  }
});
