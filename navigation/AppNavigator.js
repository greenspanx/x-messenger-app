import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from 'react-navigation';

import MainTabNavigatorWrapper from './MainTabNavigatorWrapper';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import AuthLoadingScreen from '../screens/Auth/AuthLoadingScreen';


const AuthStack = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen,

});

export default createAppContainer(
  createSwitchNavigator(
    {
      App: MainTabNavigatorWrapper,
      AuthLoading: AuthLoadingScreen,
      Auth: AuthStack
    },
    { initialRouteName: 'AuthLoading' }
  )
);
