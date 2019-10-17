import React from 'react';
import { StyleSheet, View, FlatList, AsyncStorage, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import i18n from 'i18n-js';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import UserItem from '../components/Items/UserItem';
import API from '../api';
import LoadingIndicator from '../components/Loading/LoadingIndicator';
import HeaderRightButton from '../components/HeaderRightButton';
import EmptyText from '../components/EmptyText';
// context consumer 
import { connectModalize } from '../context/ModalizeContext';
import { navigateToConversation } from '../navigation/NavigationService';

@connectModalize
export default class ContactsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('title'),
    headerLeft: (
      <HeaderRightButton
        onPress={navigation.getParam('handleOpenSearchModal')}
        renderIcon={() => (
          <MaterialIcons size={25} name={'search'} color={'#5a5a5a'} />
        )}
      />
    ),
    headerRight: (
      <HeaderRightButton
        onPress={navigation.getParam('handleSyncContacts')}
        loading={navigation.getParam('loadingSync', false)}
        renderIcon={() => (
          <Ionicons size={28} name={'md-sync'} color={'#5a5a5a'} />
        )}
      />
    )
  });

  state = {
    contacts: [],
    loading: false
  };

  componentDidMount() {
    this.props.navigation.setParams({
      title: i18n.t('contacts'),
      handleSyncContacts: this.handleSyncContacts,
      handleOpenSearchModal: this.handleOpenSearchModal
    });

    this.getContacts();
    this.checkSyncContanct();
  }

  checkSyncContanct = async () => {
    const isSyncContact = await AsyncStorage.getItem('isSyncContact');

    if (!isSyncContact) {
      this.handleSyncContacts();
    }
  };

  handleOpenSearchModal = () => {
    this.props.openModalize('Search');
  };

  getContacts = async () => {
    this.setState({
      loading: true,
      contacts: []
    });
    try {
      const contacts = await API('/contacts/get');

      this.setState({
        loading: false,
        contacts
      });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
      Alert.alert(i18n.t('error'), 'Error connection');
    }
  };

  handleSyncContacts = async () => {
    const { navigation } = this.props;
    const phoneNumbers = await this.getPhoneNumbers();
    if (phoneNumbers.length < 1) return;

    navigation.setParams({ loadingSync: true });
    try {
      await API('/contacts/sync', { phone_numbers: phoneNumbers.join(',') });

      AsyncStorage.setItem('isSyncContact', 'true');

      navigation.setParams({ loadingSync: false });
      this.getContacts();
    } catch (err) {
      Alert.alert(i18n.t('error'), 'Error connection');
      navigation.setParams({ loadingSync: false });
    }
  };

  removeSymbolsPhoneNumber = s => {
    return s.replace(/[^0-9]/g, '');
  };

  getPhoneNumbers = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CONTACTS);
      if (status !== 'granted') {
        return [];
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers]
      });

      if (data.length > 0) {
        let phoneNumbers = [];
        for (let contact of data) {
          if (contact.phoneNumbers) {
            for (let phone of contact.phoneNumbers) {
              phoneNumbers.push(this.removeSymbolsPhoneNumber(phone.number));
            }
          }
        }

        return phoneNumbers;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        i18n.t('error'),
        'Go to settings and allow access to contacts'
      );
    }
  };

  render() {
    const { contacts, loading } = this.state;

    return (
      <View style={styles.container}>
        <LoadingIndicator isVisible={loading} />
        <EmptyText isVisible={!contacts.length && !loading}>
          {i18n.t('empty_contacts')}
        </EmptyText>
        <FlatList
          contentContainerStyle={styles.contactsList}
          data={contacts}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              onPress={() => navigateToConversation(item)}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contactsList: {
    paddingVertical: 20
  }
});
