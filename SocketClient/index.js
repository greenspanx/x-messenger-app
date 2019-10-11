import SocketIOClient from 'socket.io-client';
import store from '../redux/store';
import { jsonToUrl } from '../utils';
import { markAsRead, appendMessage } from '../redux/actions/ConversationActions';
import { updateDialog, socketConnected } from '../redux/actions/DialogsActions';
import { incrementBadge } from '../redux/actions/BadgeActions';
import Config from '../config';

export default function SocketClient(onEvent = () => {}) {
  const user = store.getState().user;

  /*
   * transports: ['polling'] because websocket at the moment gives an error
   * see: https://github.com/socketio/socket.io-client/issues/1290
   */
  const SocketInstance = SocketIOClient(Config.socketHost, {
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: Infinity,
    jsonp: false,
    transports: ['polling'],
    autoConnect: false,
    query: jsonToUrl({
      user_id: user._id,
      token: user.socket_token
    })
  });

  SocketInstance.on('connect', () => {
    onEvent('connect');
    store.dispatch(socketConnected(true));
  });

  SocketInstance.on('disconnect', () => {
    onEvent('disconnect');
    store.dispatch(socketConnected(false));
  });

  SocketInstance.on('newMessage', data => {
    onEvent('newMessage', data);
    store.dispatch(updateDialog(data.dialog_id, data.message, data.sender));
    store.dispatch(appendMessage(data.sender._id, data.message));
    store.dispatch(incrementBadge(1));
  });

  SocketInstance.on('markAsRead', data => {
    onEvent('markAsRead', data);
    store.dispatch(markAsRead(data.recipient_id, data.ids));
  });

  return SocketInstance;
}
