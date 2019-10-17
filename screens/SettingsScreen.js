import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18n-js';
import { connect } from 'react-redux';
import { userLogout, userUpdate } from '../redux/actions/UserActions';
import { loadDialogs } from '../redux/actions/DialogsActions';
import UploadUserPicture from '../components/UploadUserPicture';
import { List, ListItem, Link } from '../components/UI';
import LoadingIndicator from '../components/Loading/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import API from '../api';

@connect(
  null,
  { userLogout, userUpdate, loadDialogs }
)
export default class SettingsScreen extends React.Component {
  static navigationOptions = () => ({
    title: i18n.t('settings')
  });

  state = {
    user: false,
    isLoading: false,
    isErrorLoad: false
  };

  componentDidMount() {
    this.getUser();
  }

  getUser = () => {
    this.setState({
      isLoading: true,
      isErrorLoad: false
    });

    API('/users/getCurrentUser')
      .then(user => {
        this.setState({
          isErrorLoad: false,
          isLoading: false,
          user
        });
      })
      .catch(() => {
        this.setState({
          isErrorLoad: true,
          isLoading: false
        });
      });
  };

  handlePressLogout = async () => {
    this.props.userLogout().then(() => {
      this.props.navigation.navigate('Auth');
    });
  };

  handleSave = (type, params) => {
    if (type === 'profile') {
      this.props.userUpdate(params);
      this.setState(prevState => ({
        user: {
          ...prevState.user,
          ...params
        }
      }));

      this.props.loadDialogs({ refreshing: true });
    }
  };

  render() {
    const { user, isLoading, isErrorLoad } = this.state;

    return (
      <>
        <LoadingIndicator isVisible={isLoading} />
        <View style={styles.container}>
          <ErrorMessage
            isVisible={isErrorLoad && !isLoading}
            retry={this.getUser}
          />
          <KeyboardAwareScrollView enableOnAndroid>
            {user && (
              <>
                <View style={styles.contentWrapper}>
                  <UploadUserPicture
                    onSave={this.handleSave}
                    user={user}
                    size={100}
                  />
                  <Text style={styles.name}>
                    {user.first_name} {user.last_name}
                  </Text>
                </View>

                <List>
                  <ListItem
                    title={i18n.t('change_info')}
                    onPress={() => {
                      this.props.navigation.navigate('ChangeProfile', {
                        onSave: this.handleSave
                      });
                    }}
                  />
                  <ListItem
                    title={i18n.t('change_password')}
                    onPress={() => {
                      this.props.navigation.navigate('ChangePassword', {
                        onSave: this.handleSave
                      });
                    }}
                  />
                </List>
              </>
            )}

            <View style={styles.contentWrapper}>
              <Link onPress={this.handlePressLogout} color={'danger'}>
                {i18n.t('logout')}
              </Link>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentWrapper: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    marginTop: 18,
    paddingHorizontal: 15,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#595959',
    textAlign: 'center'
  }
});
