import React from 'react';
import { AsyncStorage } from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  async componentDidMount() {
    const user = await AsyncStorage.getItem('User');
    this.props.navigation.navigate(user ? 'App' : 'Auth');
  }

  render() {
    return null;
  }
}
