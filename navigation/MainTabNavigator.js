import React, { Component } from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { tabBarOptions, navigatorOptions } from '../constants/Colors';

import DialogsIconWithBadge from '../components/DialogsIconWithBadge';
import TabBarIcon from '../components/TabBarIcon';



import ImageViewerScreen from '../screens/ImageViewerScreen';

class ContactsScreen extends Component {
	render() {
    return (
      <View style={styles.container}>
        <Text>ContactsScreen</Text>
      </View>
    );
  }

class xDialogsScreen extends Component {

	render() {
      return (
        <View style={styles.container}>
          <Text>DialogsScreen</Text>
        </View>
      );
}

class SettingsScreen extends Component {
	render() {

      return (
        <View style={styles.container}>
          <Text>SettingsScreen</Text>
        </View>
      );
}

class ChangeProfileScreen extends Component {
	render() {

      return (
        <View style={styles.container}>
          <Text>ChangeProfileScreen</Text>
        </View>
      );
}

class ChangePasswordScreen extends Component {
	render() {

      return (
        <View style={styles.container}>
          <Text>ChangePasswordScreen</Text>
        </View>
    );
}

const SearchStack = createStackNavigator({ ContactsScreen: ContactsScreen }, navigatorOptions);

SearchStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'android' ? 'md-contact' : 'ios-contact'}
    />
  )
};

const DialogsStack = createStackNavigator({ xDialogsScreen: xDialogsScreen }, navigatorOptions);
DialogsStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <DialogsIconWithBadge>
      <TabBarIcon focused={focused} name={'ios-chatbubbles'} />
    </DialogsIconWithBadge>
  )
};

const SettingsStack = createStackNavigator(
  {
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        headerBackTitle: null
      }
    },
    ChangeProfile: ChangeProfileScreen,
    ChangePassword: ChangePasswordScreen
  },
  navigatorOptions
);
SettingsStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'android' ? 'md-settings' : 'ios-cog'}
    />
  )
};

const BottomTabNavigator = createBottomTabNavigator(
  {
    SearchStack,
    DialogsStack,
    SettingsStack
  },
  {
    tabBarOptions,
    initialRouteName: 'DialogsStack'
  }
);

export default createStackNavigator(
  {
    Main: {
      screen: BottomTabNavigator,
      navigationOptions: {
        header: null,
        headerBackTitle: null
      }
    },
    Conversation: {
      screen: ConversationScreen,
      navigationOptions: {
        headerBackTitle: null
      }
    },
    ImageViewer: ImageViewerScreen
  },
  navigatorOptions
);
