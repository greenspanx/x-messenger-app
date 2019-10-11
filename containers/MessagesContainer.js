import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18n-js';
import Message from '../components/Items/MessageItem';
import { isIphoneX } from '../constants/Layout';

export default class MessagesContainer extends React.PureComponent {
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow
    );

    // Fix SafeAreaView bug
    if (isIphoneX()) {
      this.keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        () => this.setState({ isVisibleKeyboard: true })
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => this.setState({ isVisibleKeyboard: false })
      );
    }
  }

  state = {
    isVisibleKeyboard: false
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();

    if (isIphoneX()) {
      this.keyboardWillShowListener.remove();
      this.keyboardWillHideListener.remove();
    }
  }

  _keyboardDidShow = () => (this.isVisibleKeyboard = true);

  dismissKeyboardWhenScrollUp = ev => {
    let curPositionScroll = Math.max(ev.nativeEvent.contentOffset.y, 0);

    if (!this.isVisibleKeyboard || this._momentumScroll) {
      this._lastPositionScroll = curPositionScroll;
      return;
    }

    if (this._lastPositionScroll < curPositionScroll) {
      Keyboard.dismiss();

      this.isVisibleKeyboard = false;
    }

    this._lastPositionScroll = curPositionScroll;
  };

  renderKeyboardAccessory() {
    const {
      onChangeInputText,
      inputText,
      onSendMessage,
      onPressAttachment
    } = this.props;
    const animateOn = isIphoneX() ? 'all' : undefined;

    return (
      <KeyboardAccessoryView
        style={styles.accssoryView}
        alwaysVisible
        avoidKeyboard
        bumperHeight={30}
        animateOn={animateOn}
        hideBorder
      >
        <View style={styles.textInputContainer}>
          <TouchableOpacity
            onPress={onPressAttachment}
            style={styles.buttonPhoto}
          >
            <Ionicons name={'ios-camera'} size={35} color={'#37aff1'} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            style={styles.inputContainer}
            onPress={() => this.input.focus()}
          >
            <TextInput
              ref={r => (this.input = r)}
              editable
              multiline
              style={styles.textInput}
              onChangeText={onChangeInputText}
              value={inputText}
              placeholder={i18n.t('type_a_message')}
              placeholderTextColor={'#9a9a9a'}
              selectionColor={'black'}
            />
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={onSendMessage} style={styles.buttonSend}>
              <View style={styles.gradientWrapper}>
                <LinearGradient
                  start={[0, 1]}
                  end={[1, 0]}
                  style={styles.buttonSendGradient}
                  colors={['#5794d8', '#29beff']}
                >
                  <MaterialIcons
                    name={'keyboard-arrow-right'}
                    size={25}
                    color={'#fff'}
                  />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {isIphoneX() && !this.state.isVisibleKeyboard && (
          <View style={{ height: 30 }} />
        )}
      </KeyboardAccessoryView>
    );
  }

  renderLoadingComponent = () => {
    const { loading, loadingMore } = this.props;

    if (loading || loadingMore) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="small" />
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    let { messages, ownerID, onLoadMore, flatListRef } = this.props;
    let lastMessage = messages[0];
    let lastMessageID = lastMessage ? lastMessage._id : '';

    return (
      <View style={styles.container}>
        <FlatList
          removeClippedSubviews
          onScroll={this.dismissKeyboardWhenScrollUp}
          ListFooterComponent={this.renderLoadingComponent}
          onMomentumScrollBegin={() => {
            this._momentumScroll = true;
          }}
          onMomentumScrollEnd={() => {
            this._momentumScroll = false;
          }}
          contentContainerStyle={styles.flatList}
          ref={r => {
            this.scroll = r;
            if (flatListRef) {
              flatListRef(r);
            }
          }}
          inverted
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.75}
          data={messages}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => (
            <Message
              lastMessageID={lastMessageID}
              previousMessage={messages[index + 1]}
              isOwner={ownerID === item.sender_id}
              message={item}
            />
          )}
        />

        {this.renderKeyboardAccessory()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  loading: {
    marginVertical: 10
  },
  newMessage: {
    position: 'absolute',
    width: 20,
    height: 20,
    marginTop: 17,
    left: -30
  },
  buttonPhoto: {
    marginRight: 8,
    marginLeft: 3
  },
  gradientWrapper: {
    overflow: 'hidden',
    borderRadius: 100
  },
  buttonSendGradient: {
    padding: 5
  },
  buttonSend: {
    marginLeft: 7
  },
  accssoryView: {
    paddingHorizontal: 7,
    backgroundColor: '#fff',
    shadowColor: 'rgb(46, 61, 73)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 20
  },
  textInputContainer: {
    flexDirection: 'row',
    paddingVertical: 8
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#f3f4f5',
    overflow: 'hidden',
    borderRadius: 20
  },
  textInput: {
    maxHeight: 100,
    margin: 10,
    paddingLeft: 5,
    marginTop: 5,
    fontSize: 16,
    color: 'black'
  },
  flatList: {
    paddingVertical: 5
  }
});
