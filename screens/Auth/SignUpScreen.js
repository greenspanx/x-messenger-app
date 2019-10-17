import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18n-js';
import { connect } from 'react-redux';
import API from '../../api';
import { userLogin } from '../../redux/actions/UserActions';
import Colors from '../../constants/Colors';
import { Input, Button } from '../../components/UI';
import InputUsername from '../../components/InputUsername';
import { isValidPhoneNumber } from '../../utils';

@connect(
  null,   // mapStateToProps
  { userLogin }  // mapActionToProps
)
export default class SignUpScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: '#fff'
    },
    headerTintColor: Colors.primary
  };

  state = {
    loading: false,
    errorValidation: false,
    phone: '',
    password: '',
    password_again: '',
    username: '',
    first_name: '',
    last_name: '',
    isAvailableUsername: false
  };

  handlePressSignIn = async () => {
    const { navigation } = this.props;
    let {
      phone,
      password,
      password_again,
      first_name,
      last_name,
      isAvailableUsername,
      username
    } = this.state;

    if (!isValidPhoneNumber(phone)) {
      this.setState({ errorValidation: true });
      return Alert.alert(i18n.t('error'), i18n.t('wrong_phone_format'));
    }

    if (!isAvailableUsername) {
      this.setState({ errorValidation: true });
      return Alert.alert(i18n.t('error'), i18n.t('username_not_available'));
    }

    if (
      phone === '' ||
      password === '' ||
      first_name === '' ||
      last_name === ''
    ) {
      this.setState({ errorValidation: true });
      return Alert.alert(i18n.t('error'), i18n.t('please_fill_all_fields'));
    }

    if (password !== password_again) {
      return Alert.alert(i18n.t('error'), i18n.t('passwords_do_not_match'));
    }

    if (password.length < 6) {
      return Alert.alert(i18n.t('error'), i18n.t('password_error_length'));
    }

    this.setState({ loading: true, errorValidation: false });

    // Prepare
    phone = phone
      .replace(')', '')
      .replace('(', '')
      .replace('+', '')
      .replace(/-/g, '');

    try {
      let user = await API('/auth/signUp', {
        first_name,
        last_name,
        phone,
        password,
        username
      });

      this.setState({ loading: false });
      this.props.userLogin(user).then(() => {
        navigation.navigate('App');
      });
    } catch (error) {
      let message = null;
      this.setState({ loading: false });

      if (error.code === 1004) {
        message = i18n.t('phone_number_busy');
      } else {
        if (error.code) {
          message = `error code: ${error.code}`;
        }
      }

      Alert.alert(i18n.t('error'), message || i18n.t('unknown_error'));
    }
  };

  handleChangeUsername = username => {
    this.setState({ username });
  };

  render() {
    const {
      loading,
      first_name,
      last_name,
      phone,
      password,
      password_again,
      errorValidation
    } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          enableOnAndroid
        >
          <View style={styles.wrapper}>
            <Text style={styles.title}>{i18n.t('sign_up')}</Text>

            <View style={styles.inputsContainer}>
              <Input
                onChangeText={first_name => this.setState({ first_name })}
                returnKeyType={'next'}
                label={i18n.t('first_name')}
                placeholder={'first name'}
                value={first_name}
                error={errorValidation}
              />

              <Input
                onChangeText={last_name => this.setState({ last_name })}
                returnKeyType={'next'}
                label={i18n.t('last_name')}
                placeholder={'last name'}
                value={last_name}
                error={errorValidation}
              />

              <Input
                onChangeText={phone => this.setState({ phone })}
                returnKeyType={'next'}
                label={i18n.t('phone_number')}
                placeholder={i18n.t('mobile_phone')}
                value={phone}
                textContentType={'telephoneNumber'}
                error={errorValidation}
              />

              <InputUsername
                error={errorValidation}
                onChangeText={username => this.setState({ username })}
                onAvailable={isAvailableUsername =>
                  this.setState({ isAvailableUsername })
                }
              />

              <Input
                onChangeText={password => this.setState({ password })}
                returnKeyType={'next'}
                label={i18n.t('password')}
                placeholder={'••••••••'}
                secureTextEntry
                value={password}
                textContentType={'password'}
                error={errorValidation}
              />
              <Input
                onChangeText={password_again =>
                  this.setState({ password_again })
                }
                returnKeyType={'go'}
                label={i18n.t('password_again')}
                placeholder={'••••••••'}
                secureTextEntry
                value={password_again}
                textContentType={'password'}
                error={errorValidation}
              />
            </View>

            <Button
              title={i18n.t('sign_up')}
              color={'primary'}
              isLoading={loading}
              onPress={this.handlePressSignIn}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  wrapper: {
    width: 248,
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  title: {
    fontSize: 35,
    textAlign: 'center'
  },
  inputsContainer: {
    marginVertical: 20
  }
});
