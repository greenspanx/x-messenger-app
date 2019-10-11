import { updateItem, updateItemById } from 'redux-toolbelt-immutable-helpers';
import { types } from '../actions/DialogsActions';

const initialState = {
  items: [],
  isLoading: false,
  isRefreshing: false,
  isErrorLoad: false,
  isLoadingMore: false,
  isStopLoadMore: false,
  isSocketConnected: false
};

export default function dialogs(state = initialState, action) {
  switch (action.type) {
    case types.START_LOADING_MORE_DIALOGS:
      return {
        ...state,
        isLoadingMore: true
      };
    case types.START_LOADING_DIALOGS:
      return {
        ...state,
        isLoading: true
      };
    case types.START_REFRESHING_DIALOGS:
      return {
        ...state,
        isRefreshing: true
      };
    case types.COMPLETE_LOADING_DIALOGS:
      return {
        ...state,
        items: action.payload.items,
        isRefreshing: false,
        isErrorLoad: false,
        isLoading: false,
        isLoadingMore: false,
        isStopLoadMore: false
      };
    case types.COMPLETE_LOADING_MORE_DIALOGS:
      return {
        ...state,
        ...(action.payload.items.length < 1 && {
          isStopLoadMore: true
        }),
        items: [...state.items, ...action.payload.items],
        isLoadingMore: false
      };
    case types.ERROR_LOADING_DIALOGS:
      return {
        ...state,
        isLoading: false,
        isErrorLoad: true
      };
    case types.UPDATE_DIALOG:
      return {
        ...state,
        items: updateDialog(state, action)
      };
    case types.UPDATE_UNREAD_DIALOG: {
      return {
        ...state,
        items: updateUnreadDialog(state, action)
      };
    }
    case types.REMOVE_DIALOG: {
      const items = state.items.filter(item => item._id !== action.dialog_id);
      return { ...state, items };
    }
    case types.SOCKET_CONNECTED:
      return {
        ...state,
        isSocketConnected: action.isConnected
      };
    default:
      return state;
  }
}

function updateUnreadDialog(state, { dialog_id, reedCount }) {
  return updateItemById(
    state.items,
    dialog_id,
    item => ({
      unread_count: Math.max(item.unread_count - reedCount, 0),
      last_message: {
        ...item.last_message,
        unread: 0
      }
    }),
    item => item._id
  );
}

function updateDialog(state, { dialog_id, message, member, user_id }) {
  const isImNotSender = message.sender_id !== user_id;
  let dialogs;

  const itemIndex = state.items.findIndex(item => item._id === dialog_id);
  if (itemIndex !== -1) {
    dialogs = updateItem(state.items, itemIndex, item => ({
      last_message: message,
      ...(isImNotSender && {
        unread_count: item.unread_count + 1
      })
    }));
  } else {
    dialogs = [
      {
        _id: dialog_id,
        last_message: message,
        unread_count: isImNotSender ? 1 : 0,
        member
      },
      ...state.items
    ];
  }

  dialogs.sort((a, b) => (a.last_message.date > b.last_message.date ? -1 : 1));

  return dialogs;
}
