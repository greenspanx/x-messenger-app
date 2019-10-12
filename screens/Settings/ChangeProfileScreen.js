import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import i18n from 'i18n-js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import API from '../../api';
import { Input } from '../../components/UI';
import InputUsername from '../../components/InputUsername';
import HeaderRightButton from '../../components/HeaderRightButton';

@connect(({ user }) => ({ user }))
export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: i18n.t('change_info'),
    headerRight: (
      <HeaderRightButton
        disabled={navigation.getParam('disabledSave')}
        onPress={navigation.getParam('handlePressSave', () => {})}
        loading={navigation.getParam('isLoading', false)}
        title={i18n.t('save')}
      />
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      first_name: props.user.first_name,
      last_name: props.user.last_name,
      username: props.user.username,
      isAvailableUsername: true
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handlePressSave: this.handlePressSave
    });
  }

  handlePressSave = () => {
    const { first_name, last_name, username } = this.state;
    const { navigation } = this.props;
    const onSave = navigation.getParam('onSave', () => {});

    navigation.setParams({ isLoading: true });

    const query = { first_name, last_name, username };
    API('/account/changeInfo', query)
      .then(updatedUser => {
        navigation.setParams({ isLoading: false });
        onSave('profile', updatedUser);
        navigation.goBack();
      })
      .catch(err => {
        navigation.setParams({ isLoading: false });
        Alert.alert('Error', JSON.stringify(err));
      });
  };

  checkFields = () => {
    const { first_name, last_name, username, isAvailableUsername } = this.state;

    const disabledSave =
      first_name === '' ||
      last_name === '' ||
      username === '' ||
      !isAvailableUsername;

    this.props.navigation.setParams({ disabledSave });
  };

  handleChange = field => text => {
    this.setState({ [field]: text }, this.checkFields);
  };

  render() {
    const { first_name, last_name } = this.state;
    const { user } = this.props;

    return (
      <KeyboardAwareScrollView enableOnAndroid>
        <View style={styles.container}>
          <Input
            onChangeText={this.handleChange('first_name')}
            label={i18n.t('first_name')}
            placeholder={'Jonny'}
            value={first_name}
          />

          <Input
            onChangeText={this.handleChange('last_name')}
            label={i18n.t('last_name')}
            placeholder={'Ive'}
            value={last_name}
          />

          <InputUsername
            defaultValue={user.username}
            onChangeText={username => this.setState({ username })}
            onAvailable={this.handleChange('isAvailableUsername')}
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
