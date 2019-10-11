import React from 'react';
import { Vibration } from 'react-native';

import { Notifications } from 'expo';
import MainTabNavigator from './MainTabNavigator';

import TopBarNotification from '../components/TopBarNotification';

import NavigationService, {
  navigateToConversation
} from '../navigation/NavigationService';


export default class MainTabNavigatorWrapper extends React.Component {
  static router = MainTabNavigator.router;

  topBarNotification = React.createRef();


  componentDidMount() {

  }

  componentWillUnmount() {

  }

  componentDidUpdate(prevProps) {

  }





  render() {
    return (
      <>
        <TopBarNotification ref={this.topBarNotification} />
        <MainTabNavigator {...this.props} />
      </>
    );
  }
}
