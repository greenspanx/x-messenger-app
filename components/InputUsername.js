import React from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import i18n from 'i18n-js';
import { Input } from './UI';
import API from '../api';
import Colors from '../constants/Colors';

export default class InputUsername extends React.Component {
  static defaultProps = {
    onChangeText: () => {},
    onAvailable: () => {},
    defaultValue: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue,
      isAvailable: true,
      isLoading: false
    };
  }

  checkAvailable = username => {
    const { value } = this.state;

    API('/users/checkUsernameAvailable', { username })
      .then(isAvailable => {
        if (username === value) {
          this.setState({
            isLoading: false,
            isAvailable
          });

          this.props.onAvailable(isAvailable);
        }
      })
      .catch(err => {
        let isAvailable = false;
        if (username === value) {
          if (err.request && err.request.status < 1) {
            Alert.alert(
              i18n.t('error'),
              'Error network connection. Please check your API host in config file '
            );

            isAvailable = true;
          }

          this.setState({
            isLoading: false,
            isAvailable
          });

          this.props.onAvailable(isAvailable);
        }
      });
  };

  timeoutFastTyping = false;
  handleChangeUsername = async value => {
    const { defaultValue } = this.props;
    this.props.onChangeText(value);

    this.setState({
      isAvailable: true,
      isLoading: !!value,
      value
    });

    if (defaultValue === value) {
      this.props.onAvailable(true);
      this.setState({
        isLoading: false,
        isAvailable: true
      });

      return;
    }

    if (value) {
      if (this.timeoutFastTyping) {
        clearTimeout(this.timeoutFastTyping);
      }

      this.timeoutFastTyping = setTimeout(() => {
        this.checkAvailable(value);
        this.timeoutFastTyping = false;
      }, 400);
    }
  };

  render() {
    const { value, isAvailable, isLoading } = this.state;
    const color = !isAvailable && { color: Colors.danger };

    return (
      <Input
        error={this.props.error}
        style={color}
        label={i18n.t('username')}
        placeholder={'jonnyive'}
        keyboardType={'ascii-capable'}
        autoCapitalize={'none'}
        autoCorrect={false}
        symbol={'@'}
        onChangeText={this.handleChangeUsername}
        value={value}
        renderLeftComponent={isLoading ? () => <ActivityIndicator /> : null}
      />
    );
  }
}
