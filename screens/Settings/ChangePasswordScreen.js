import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import i18n from 'i18n-js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import API from '../../api';
import { Input } from '../../components/UI';
import HeaderRightButton from '../../components/HeaderRightButton';

@connect(({ user }) => ({ user }))
export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: i18n.t('change_password'),
    headerRight: (
      <HeaderRightButton
        disabled={navigation.getParam('disabledSave')}
        onPress={navigation.getParam('handlePressSave', () => {})}
        loading={navigation.getParam('isLoading', false)}
        title={i18n.t('save')}
      />
    )
  });

  state = {
    password: '',
    password_again: ''
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handlePressSave: this.handlePressSave
    });
  }

  handlePressSave = () => {
    const { password, password_again } = this.state;
    const { navigation } = this.props;
    const onSave = navigation.getParam('onSave', () => {});

    if (password !== password_again) {
      return Alert.alert(i18n.t('error'), i18n.t('passwords_do_not_match'));
    }

    if (password.length < 6) {
      return Alert.alert(i18n.t('error'), i18n.t('password_error_length'));
    }

    navigation.setParams({ isLoading: true });

    API('/account/changePassword', { password })
      .then(updatedUser => {
        navigation.setParams({ isLoading: false });
        onSave('password');
        navigation.goBack();
      })
      .catch(err => {
        navigation.setParams({ isLoading: false });
        Alert.alert('Error', JSON.stringify(err));
      });
  };

  checkFields = () => {
    const { password, password_again } = this.state;
    const disabledSave = password === '' || password_again === '';

    this.props.navigation.setParams({ disabledSave });
  };

  handleChange = field => text => {
    this.setState({ [field]: text }, this.checkFields);
  };

  render() {
    const { password, password_again } = this.state;

    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <View style={styles.container}>
          <Input
            onChangeText={this.handleChange('password')}
            label={i18n.t('new_password')}
            placeholder={'••••••••'}
            secureTextEntry
            value={password}
            textContentType={'password'}
          />
          <Input
            onChangeText={this.handleChange('password_again')}
            label={i18n.t('new_password_again')}
            placeholder={'••••••••'}
            secureTextEntry
            value={password_again}
            textContentType={'password'}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 15
  }
});
