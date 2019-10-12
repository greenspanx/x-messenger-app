import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import i18n from 'i18n-js';
import { connect } from 'react-redux';
import { choosePhoto, takePhoto } from '../utils/ImagePicker';

import MessagesContainer from '../containers/MessagesContainer';
import UserItem from '../components/Items/UserItem';

import { MessageUploaderProvider } from '../context/MessageUploaderContext';

import {
  loadMessages,
  markAsReadRecipient,
  appendMessage,
  removeMessage,
  sendMessage,
  deleteDialog,
  loadMoreMessages
} from '../redux/actions/ConversationActions';

import { makeUniqueConversationSelector } from '../redux/selectors.js';

const mapStateToProps = (state, props) => {
  const selectConversation = makeUniqueConversationSelector();
  const recipient = props.navigation.getParam('recipient', {});
  const lastMessage = props.navigation.getParam('lastMessage', false);

  return state => {
    const conversation = selectConversation(state, recipient._id);

    return {
      ...conversation,
      recipient,
      user: state.user,
      lastMessage
    };
  };
};

const mapDispatchToProps = {
  deleteDialog,
  loadMessages,
  markAsReadRecipient,
  appendMessage,
  sendMessage,
  removeMessage,
  loadMoreMessages
};

@connectActionSheet
@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class ConversationScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRightContainerStyle: { right: 10 },
    headerTitle: (
      <UserItem
        style={{ paddingHorizontal: 0, marginBottom: 0 }}
        pictureSize={35}
        user={navigation.getParam('recipient', {})}
      />
    ),
    headerRight: (
      <TouchableOpacity onPress={navigation.getParam('openActionSheetMore')}>
        <MaterialIcons name="more-horiz" size={28} color="#000" />
      </TouchableOpacity>
    )
  });

  state = {
    inputText: ''
  };

  componentDidMount() {
    const { navigation, recipient, lastMessage } = this.props;

    navigation.setParams({
      openActionSheetMore: this.openActionSheetMore
    });

    this.props.loadMessages(recipient._id);
    if (lastMessage) {
      this.props.appendMessage(recipient._id, {
        ...lastMessage,
        preview: true
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.messages.length > prevProps.messages.length) {
      if (!prevProps.isLoading && !this.props.isLoading) {
        this.props.markAsReadRecipient(this.props.recipient._id);
        this.flatListRef.scrollToOffset({ offset: 0 });
      }
    }
  }

  openActionSheetMore = () => {
    this.props.showActionSheetWithOptions(
      {
        options: [i18n.t('remove_dialog'), i18n.t('cancel')],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          this.handlePressDeleteDialog();
        }
      }
    );
  };

  handlePressDeleteDialog = () => {
    const { dialog_id, deleteDialog, navigation } = this.props;
    deleteDialog(dialog_id).then(() => navigation.goBack());
  };

  handleSendMessage = () => {
    const { inputText } = this.state;
    const { recipient } = this.props;

    if (inputText !== '') {
      this.props.sendMessage(recipient._id, {
        text: inputText,
        recipient
      });

      this.setState({ inputText: '' });
    }
  };

  handlePressAttachment = () => {
    const options = [
      i18n.t('cancel'),
      i18n.t('choose_photo'),
      i18n.t('take_photo')
    ];

    this.props.showActionSheetWithOptions(
      { options, cancelButtonIndex: 0 },
      buttonIndex => {
        if (buttonIndex === 1) {
          choosePhoto(this.startUploadPhoto);
        } else if (buttonIndex === 2) {
          takePhoto(this.startUploadPhoto);
        }
      }
    );
  };

  startUploadPhoto = photo => {
    this.messageUploader.uploadPhoto(this.props.recipient, photo);
  };

  render() {
    const {
      messages,
      isLoading,
      user,
      loadMoreMessages,
      recipient
    } = this.props;

    const { inputText } = this.state;

    return (
      <View style={styles.container}>
        <MessageUploaderProvider
          refUploader={ref => (this.messageUploader = ref)}
        >
          <MessagesContainer
            flatListRef={ref => (this.flatListRef = ref)}
            ownerID={user._id}
            messages={messages}
            loading={isLoading}
            inputText={inputText}
            onChangeInputText={inputText => this.setState({ inputText })}
            onLoadMore={() => loadMoreMessages(recipient._id)}
            onPressAttachment={this.handlePressAttachment}
            onSendMessage={this.handleSendMessage}
          />
        </MessageUploaderProvider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
