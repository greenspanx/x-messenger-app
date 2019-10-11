import API from '../../api';
import {
  updateDialog,
  updateUnreadDialog,
  removeDialog
} from './DialogsActions';
import { decrementBadge } from './BadgeActions';
import { getRandomID } from '../../utils';

export const types = {
  START_LOADING_CONVERSATION: 'CONVERSATION/START_LOADING',
  COMPLETE_LOADING_CONVERSATION: 'CONVERSATION/COMPLETE_LOADING',
  COMPLETE_LOADING_MORE_CONVERSATION: 'CONVERSATION/COMPLETE_LOADING_MORE',
  ERROR_LOADING_CONVERSATION: 'CONVERSATION/ERROR_LOADING',
  UPDATE_MESSAGE: 'CONVERSATION/UPDATE_MESSAGE',
  NEW_MESSAGE: 'CONVERSATION/NEW_MESSAGE',
  MARK_AS_REED: 'CONVERSATION/MARK_AS_REED',
  REMOVE_MESSAGE: 'CONVERSATION/REMOVE_MESSAGE'
};

export const updateMessage = (recipient_id, messageID, message) => ({
  type: types.UPDATE_MESSAGE,
  recipient_id,
  messageID,
  message
});

export const markAsRead = (recipient_id, ids) => ({
  type: types.MARK_AS_REED,
  recipient_id,
  ids
});

export const appendMessage = (recipient_id, message) => (
  dispatch,
  getState
) => {
  const conversation = getState().conversations[recipient_id];

  // Prevent duplicate message
  if (conversation) {
    let messageIndex = conversation.messages.findIndex(
      item => item._id === message._id
    );

    if (messageIndex === -1) {
      dispatch({ type: types.NEW_MESSAGE, recipient_id, message });
    }
  }
};

export const loadMoreMessages = recipient_id => (dispatch, getState) => {
  const conversation = getState().conversations[recipient_id];
  if (!conversation) {
    return;
  }

  const { messages, isLoading, isStopLoadMore } = conversation;
  const offset = messages.length;

  if (offset < 20 || isLoading || isStopLoadMore) {
    return;
  }

  dispatch({ type: types.START_LOADING_CONVERSATION, recipient_id });

  return API('/messages/getHistory', { recipient_id, offset })
    .then(conversation => {
      dispatch({
        type: types.COMPLETE_LOADING_MORE_CONVERSATION,
        recipient_id,
        payload: conversation
      });

      dispatch(markAsReadRecipient(recipient_id));
    })
    .catch(err =>
      dispatch({
        type: types.ERROR_LOADING_CONVERSATION,
        recipient_id,
        payload: err
      })
    );
};

export const loadMessages = recipient_id => dispatch => {
  dispatch({ type: types.START_LOADING_CONVERSATION, recipient_id });

  return API('/messages/getHistory', { recipient_id })
    .then(conversation => {
      dispatch({
        type: types.COMPLETE_LOADING_CONVERSATION,
        recipient_id,
        payload: conversation
      });

      dispatch(markAsReadRecipient(recipient_id));
    })
    .catch(err =>
      dispatch({
        type: types.ERROR_LOADING_CONVERSATION,
        recipient_id,
        payload: err
      })
    );
};

export const markAsReadRecipient = recipient_id => (dispatch, getState) => {
  const conversation = getState().conversations[recipient_id] || {};
  const { dialog_id, messages } = conversation;

  if (messages.length < 1) {
    return;
  }

  const ids = [];
  messages.forEach(item => {
    if (
      item.sender_id === recipient_id &&
      item.unread &&
      !item.sending &&
      !item.upload
    ) {
      ids.push(item._id);
    }
  });

  if (ids.length < 1) {
    return;
  }

  API('/messages/markAsRead', {
    message_ids: ids.join(','),
    recipient_id,
    dialog_id
  })
    .then(() => {
      dispatch(markAsRead(recipient_id, ids));
      dispatch(updateUnreadDialog(dialog_id, ids.length));
      dispatch(decrementBadge(ids.length));
    })
    .catch(err => console.log(err));
};

export const sendMessage = (recipient_id, payload) => (dispatch, getState) => {
  const { text, recipient, attachment, photoRaw } = payload;
  const conversation = getState().conversations[recipient_id] || {};
  const sender_id = getState().user._id;
  const randomMessageID = getRandomID(10);
  const { dialog_id } = conversation;

  const rawAttachament = photoRaw ? { photo: photoRaw } : attachment;
  const message = {
    _id: randomMessageID,
    recipient_id,
    sender_id,
    text: text || '',
    date: +new Date(),
    unread: 1,
    sending: true,
    ...(attachment && {
      attachment: rawAttachament
    })
  };

  dispatch(appendMessage(recipient_id, message));
  //dispatch(updateDialog(dialog_id, message, recipient));

  API('/messages/send', {
    ...(attachment && { attachment }),
    recipient_id,
    text
  }).then(message => {
    message = {
      ...message,
      ...(attachment && {
        attachment: rawAttachament
      }),
      ...(photoRaw && {
        photoRaw: true
      })
    };

    dispatch(updateMessage(recipient_id, randomMessageID, message));
    dispatch(updateDialog(dialog_id, message, recipient));

    if (recipient_id === sender_id) {
      dispatch(markAsReadRecipient(recipient_id));
    }
  });
};

export const deleteDialog = dialog_id => dispatch => {
  return API('/messages/deleteDialog', { dialog_id }).then(() => {
    dispatch(removeDialog(dialog_id));
  });
};

export const removeMessage = (recipient_id, message_id) => ({
  type: types.REMOVE_MESSAGE,
  recipient_id,
  message_id
});
