import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import Translations from './translations';
import { ModalizeProvider } from './context/ModalizeContext';
import { LoadingOverlayProvider } from './context/LoadingOverlayContext';
import NavigationService from './navigation/NavigationService';
import { setupUser } from './redux/actions/UserActions';

i18n.fallbacks = true;
i18n.translations = Translations;
i18n.locale = Localization.locale;

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Provider store={store}>
            <ActionSheetProvider>
              <LoadingOverlayProvider
                displayRef={NavigationService.setTopLevelLoadingOverlay}
              >
                <ModalizeProvider>
                  {/*pass navigatorRef to NavigationService*/}
                  {/*ref={(navigatorRef) => this._setNavigatorRef(navigatorRef)}*/}
                  <AppNavigator ref={NavigationService.setTopLevelNavigator} />
                </ModalizeProvider>
              </LoadingOverlayProvider>
            </ActionSheetProvider>
          </Provider>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      store.dispatch(setupUser()),
      // Asset.loadAsync([
      //   require('./assets/images/robot-dev.png'),
      //   require('./assets/images/robot-prod.png')
      // ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
