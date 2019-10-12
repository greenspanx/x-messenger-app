import React from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import i18n from 'i18n-js';
import { connect as connectRedux } from 'react-redux';
import { loadDialogs, loadMoreDialogs } from '../redux/actions/DialogsActions';
import { navigateToConversation } from '../navigation/NavigationService';
import DialogItem from '../components/Items/DialogItem';
import LoadingIndicator from '../components/Loading/LoadingIndicator';
import LoadingTextIndicator from '../components/Loading/LoadingTextIndicator';
import EmptyText from '../components/EmptyText';
import ErrorMessage from '../components/ErrorMessage';

@connectRedux(({ dialogs, user }) => ({ ...dialogs, user }), {
  loadDialogs,
  loadMoreDialogs
})
export default class DialogsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const isSocketConnected = navigation.getParam('isSocketConnected');

    if (isSocketConnected) {
      return { title: i18n.t('dialogs') };
    } else {
      return {
        headerTitle: (
          <LoadingTextIndicator text={`${i18n.t('connection')}...`} />
        )
      };
    }
  };

  componentDidMount() {
    this.props.loadDialogs();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isSocketConnected !== this.props.isSocketConnected) {
      this.props.navigation.setParams({
        isSocketConnected: this.props.isSocketConnected
      });
    }
  }

  renderLoadingComponent = () => {
    if (this.props.isLoadingMore) {
      return (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="small" />
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    const {
      items,
      isLoading,
      isRefreshing,
      isErrorLoad,
      loadDialogs,
      loadMoreDialogs,
      user
    } = this.props;

    return (
      <View style={styles.container}>
        <LoadingIndicator isVisible={isLoading} />
        <ErrorMessage
          isVisible={isErrorLoad && !isLoading}
          retry={() => loadDialogs()}
        />

        <EmptyText isVisible={!items.length && !isLoading && !isErrorLoad}>
          {i18n.t('empty_dialogs')}
        </EmptyText>

        <FlatList
          onEndReached={() => loadMoreDialogs()}
          onEndReachedThreshold={0.8}
          refreshing={isRefreshing}
          onRefresh={() => loadDialogs({ refreshing: true })}
          data={items}
          keyExtractor={item => item._id}
          ListFooterComponent={this.renderLoadingComponent}
          renderItem={({ item }) => (
            <DialogItem
              onPress={() =>
                navigateToConversation(item.member, item.last_message)
              }
              ownerID={user._id}
              member={item.member}
              message={item.last_message}
              unreadCount={item.unread_count}
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
  }
});
