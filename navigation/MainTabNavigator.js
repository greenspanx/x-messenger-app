import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { tabBarOptions, navigatorOptions } from '../constants/Colors';
import DialogsIconWithBadge from '../components/DialogsIconWithBadge';
import TabBarIcon from '../components/TabBarIcon';
import ContactsScreen from '../screens/ContactsScreen';
import DialogsScreen from '../screens/DialogsScreen';
import ConversationScreen from '../screens/ConversationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChangeProfileScreen from '../screens/Settings/ChangeProfileScreen';
import ChangePasswordScreen from '../screens/Settings/ChangePasswordScreen';
import ImageViewerScreen from '../screens/ImageViewerScreen';

const SearchStack = createStackNavigator({ ContactsScreen }, navigatorOptions);
SearchStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'android' ? 'md-contact' : 'ios-contact'}
    />
  )
};

const DialogsStack = createStackNavigator({ DialogsScreen }, navigatorOptions);
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
