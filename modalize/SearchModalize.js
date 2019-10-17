import * as React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Modalize from 'react-native-modalize';
import { MaterialIcons } from '@expo/vector-icons';
import i18n from 'i18n-js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import API from '../api';
import LoadingIndicator from '../components/Loading/LoadingIndicator';
import UserItem from '../components/Items/UserItem';
import { navigateToConversation } from '../navigation/NavigationService';

export default class SearchModalize extends React.PureComponent {
  state = {
    searchInputValue: '',
    isLoading: false,
    users: []
  };

  getUsers = value => {
    API('/users/search', { username: value })
      .then(users => {
        if (value === this.state.searchInputValue) {
          this.setState({
            isLoading: false,
            users
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  timeoutFastTyping = false;
  handleChangeSearchText = value => {
    this.setState({
      searchInputValue: value,
      isLoading: !!value,
      users: []
    });

    if (value) {
      if (this.timeoutFastTyping) {
        // Prevent the function set with the setTimeout() to execute.
        clearTimeout(this.timeoutFastTyping);
      }
      // Wait for User to Stop Typing,
      // setTimeout: getUsers after typing stopped 400 milliseconds
      this.timeoutFastTyping = setTimeout(() => {
        this.getUsers(value);
        this.timeoutFastTyping = false;
      }, 400);
    }
  };

  renderHeader = () => {
    const { searchInputValue } = this.state;

    return (
      <View style={styles.headerWrapper}>
        <View style={styles.searchInputWrapper}>
          <MaterialIcons
            name={'search'}
            size={25}
            color={'#8d8d8d'}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={i18n.t('search_by_username')}
            placeholderTextColor={'#bfbec4'}
            onChangeText={this.handleChangeSearchText}
            value={searchInputValue}
            autoFocus
          />
        </View>
      </View>
    );
  };

  renderEmptySearch = () => {
    const { searchInputValue } = this.state;

    return (
      <View style={styles.emptySearchWrapper}>
        <Text style={styles.emptySearchText}>
          {searchInputValue
            ? i18n.t('search_not_found')
            : i18n.t('search_start')}
        </Text>
      </View>
    );
  };

  render() {
    const { context } = this.props;
    const { users, isLoading } = this.state;

    return (
      <Modalize
        {...context}
        maxHeight={40}
        handlePosition="inside"
        HeaderComponent={this.renderHeader}
        keyboardAvoidingBehavior={'padding'}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled'
        }}
      >
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          enableOnAndroid
        >
          <View style={styles.container}>
            <LoadingIndicator isVisible={isLoading} />
            {!isLoading && (
              <React.Fragment>
                {users.length < 1 ? (
                  this.renderEmptySearch()
                ) : (
                  <View style={styles.usersList}>
                    {users.map((user, key) => (
                      <UserItem
                        user={user}
                        key={key}
                        onPress={() => {
                          context.ref.current.close();
                          navigateToConversation(user);
                        }}
                      />
                    ))}
                  </View>
                )}
              </React.Fragment>
            )}
          </View>
        </KeyboardAwareScrollView>
      </Modalize>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1
  },
  headerWrapper: {
    paddingTop: 25,
    padding: 15
  },
  searchInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderRadius: 5,
    padding: 13
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500'
  },

  emptySearchWrapper: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptySearchText: {
    color: '#b3b3b3'
  },

  searchIcon: {
    marginRight: 8
  },
  usersList: {}
});
