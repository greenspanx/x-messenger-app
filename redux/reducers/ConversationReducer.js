import { updateItemById } from 'redux-toolbelt-immutable-helpers';
import { types } from '../actions/ConversationActions';

export const initialConversation = {
  dialog_id: '',
  messages: [],
  isLoading: false,
  isError: false,
  isStopLoadMore: false
};

function updateByRecipientId(state, recipient_id, newState) {
  const newStateFn = conversation => {
    if (typeof newState === 'function') {
      return newState(conversation || initialConversation);
    } else {
      return newState;
    }
  };

  if (!recipient_id) {
    return { ...state };
  }

  return {
    ...state,
    [recipient_id]: {
      ...(state[recipient_id]
        ? { ...state[recipient_id] }
        : { ...initialConversation }),
      ...newStateFn(state[recipient_id])
    }
  };
}

export default function conversations(state = {}, action) {
  switch (action.type) {
    case types.INIT_CONVERSATION:
      return {
        ...state,
        [action.recipient_id]: initialConversation
      };
    case types.START_LOADING_CONVERSATION:
      return updateByRecipientId(state, action.recipient_id, {
        isLoading: true,
        isError: false
      });
    case types.COMPLETE_LOADING_CONVERSATION:
      return updateByRecipientId(state, action.recipient_id, {
        messages: action.payload.messages,
        dialog_id: action.payload.dialog_id,
        isLoading: false,
        isStopLoadMore: false,
        isError: false
      });
    case types.COMPLETE_LOADING_MORE_CONVERSATION:
      return updateByRecipientId(state, action.recipient_id, conversation => ({
        messages: [...conversation.messages, ...action.payload.messages],
        ...(action.payload.messages.length < 1 && {
          isStopLoadMore: true
        }),
        isLoading: false,
        isError: false
      }));
    case types.NEW_MESSAGE:
      return updateByRecipientId(state, action.recipient_id, conversation => ({
        messages: [action.message, ...conversation.messages]
      }));
    case types.UPDATE_MESSAGE:
      return updateByRecipientId(state, action.recipient_id, conversation => ({
        messages: updateItemById(
          conversation.messages,
          action.messageID,
          { ...action.message, sending: false },
          item => item._id
        )
      }));
    case types.MARK_AS_REED:
      return updateByRecipientId(state, action.recipient_id, conversation => ({
        messages: conversation.messages.map(item => {
          if (action.ids.indexOf(item._id) !== -1) {
            return { ...item, unread: 0 };
          }

          return item;
        })
      }));
    case types.REMOVE_MESSAGE:
      return updateByRecipientId(state, action.recipient_id, conversation => ({
        messages: conversation.messages.filter(
          item => item._id !== action.message_id
        )
      }));
    default:
      return state;
  }
}
