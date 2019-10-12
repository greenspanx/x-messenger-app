import React from 'react';
import { Vibration } from 'react-native';
import { connect } from 'react-redux';
import { Notifications } from 'expo';
import MainTabNavigator from './MainTabNavigator';
import SocketClient from '../SocketClient';
import TopBarNotification from '../components/TopBarNotification';
import registerForPushNotificationsAsync from '../registerForPushNotificationsAsync';
import NavigationService, {
  navigateToConversation
} from '../navigation/NavigationService';

@connect(({ badge }) => ({ badge }))
export default class MainTabNavigatorWrapper extends React.Component {
  static router = MainTabNavigator.router;

  topBarNotification = React.createRef();
  socketInstance = null;

  componentDidMount() {
    this.socketInstance = SocketClient(this.handleSocketEvent);
    this.socketInstance.connect();

    registerForPushNotificationsAsync();

    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  componentWillUnmount() {
    this.socketInstance.close();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.badge !== this.props.badge) {
      Notifications.setBadgeNumberAsync(this.props.badge);
    }
  }

  handleSocketEvent = (event, data) => {
    if (event === 'newMessage') {
      if (NavigationService.getCurrentRouteKey() === data.sender._id) {
        Vibration.vibrate(100);
      } else {
        this.topBarNotification.current.show(data);
      }
    }
  };

  _handleNotification = ({ origin, data }) => {
    if (origin === 'selected') {
      navigateToConversation(data.sender, data.message);
    }
  };

  render() {
    return (
      <>
        <TopBarNotification ref={this.topBarNotification} />
        <MainTabNavigator {...this.props} />
      </>
    );
  }
}
