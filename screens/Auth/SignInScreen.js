import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18n-js';
import { connect } from 'react-redux';
import { Link, Button, Input } from '../../components/UI';
import API from '../../api';
import { userLogin } from '../../redux/actions/UserActions';
import { isValidPhoneNumber } from '../../utils';

@connect(
  null,
  { userLogin }
)
export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
    headerBackTitle: null
  };

  state = {
    loading: false,
    errorValidation: false,
    phone: '',
    password: ''
  };

  handlePressSignIn = async () => {
    const { navigation } = this.props;
    let { phone, password } = this.state;

    if (!isValidPhoneNumber(phone)) {
      this.setState({ errorValidation: true });
      return Alert.alert(i18n.t('error'), i18n.t('wrong_phone_format'));
    }

    if (phone === '' || password === '') {
      this.setState({ errorValidation: true });
      return Alert.alert(i18n.t('error'), i18n.t('please_fill_all_fields'));
    }

    this.setState({ loading: true, errorValidation: false });

    // Prepare
    phone = phone
      .toString()
      .trim()
      .replace(')', '')
      .replace('(', '')
      .replace('+', '')
      .replace(/-/g, '');

    try {
      let user = await API('/auth/signIn', {
        phone,
        password
      });

      this.setState({ loading: false });

      this.props.userLogin(user).then(() => {
        navigation.navigate('App');
      });
    } catch (error) {
      console.log(error);
      let message = null;
      this.setState({ loading: false });

      if (error.code === 1002) {
        message = i18n.t('invalid_phone_number_or_password');
      } else {
        if (error.code) {
          message = `error code: ${error.code}`;
        }
      }

      Alert.alert(i18n.t('error'), message || i18n.t('unknown_error'));
    }
  };

  render() {
    const { navigation } = this.props;
    const { loading, phone, password, errorValidation } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.wrapper}>
            <Text style={styles.appName}>{i18n.t('app_name')}</Text>
            <View style={styles.inputsContainer}>
            <Input
              onChangeText={phone => this.setState({ phone })}
              returnKeyType={'go'}
              placeholder={i18n.t('mobile_phone')}
              value={phone}
              textContentType={'telephoneNumber'}
              onSubmitEditing={this.handlePressSignIn}
              error={errorValidation}
            />
              <Input
                onChangeText={password => this.setState({ password })}
                returnKeyType={'go'}
                placeholder={i18n.t('password')}
                secureTextEntry
                value={password}
                textContentType={'password'}
                onSubmitEditing={this.handlePressSignIn}
                error={errorValidation}
              />
            </View>

            <Button
              title={i18n.t('sign_in')}
              color={'primary'}
              isLoading={loading}
              onPress={this.handlePressSignIn}
            />

            <Link
              onPress={() => navigation.navigate('SignUp')}
              style={{ marginTop: 15 }}
              center
            >
              {i18n.t('sign_up')}
            </Link>
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
    marginTop: 90
  },
  appName: {
    fontSize: 35,
    textAlign: 'center'
  },
  inputsContainer: {
    marginVertical: 20
  }
});
