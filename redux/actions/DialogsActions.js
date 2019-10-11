import API from '../../api';
import { setBadge } from './BadgeActions';

export const types = {
  START_LOADING_DIALOGS: 'DIALOGS/START_LOADING',
  START_LOADING_MORE_DIALOGS: 'DIALOGS/START_LOADING_MORE',
  COMPLETE_LOADING_DIALOGS: 'DIALOGS/COMPLETE_LOADING',
  COMPLETE_LOADING_MORE_DIALOGS: 'DIALOGS/COMPLETE_LOADING_MORE',
  ERROR_LOADING_DIALOGS: 'DIALOGS/ERROR_LOADING',
  START_REFRESHING_DIALOGS: 'DIALOGS/START_REFRESHING',
  UPDATE_DIALOG: 'DIALOGS/UPDATE',
  REMOVE_DIALOG: 'DIALOGS/REMOVE',
  UPDATE_UNREAD_DIALOG: 'DIALOGS/UPDATE_UNREAD',
  SOCKET_CONNECTED: 'DIALOGS/SOCKET_CONNECTED'
};

export const socketConnected = isConnected => ({
  type: types.SOCKET_CONNECTED,
  isConnected: !!isConnected
});

export const updateDialog = (dialog_id, message, member) => (
  dispatch,
  getState
) => {
  dispatch({
    type: types.UPDATE_DIALOG,
    dialog_id,
    message,
    member,
    user_id: getState().user._id
  });
};

export const updateUnreadDialog = (dialog_id, reedCount) => ({
  type: types.UPDATE_UNREAD_DIALOG,
  dialog_id,
  reedCount
});

export const removeDialog = dialog_id => ({
  type: types.REMOVE_DIALOG,
  dialog_id
});

export const loadMoreDialogs = () => (dispatch, getState) => {
  const { items, isLoadingMore, isStopLoadMore } = getState().dialogs;
  const offset = items.length;

  if (offset < 20 || isLoadingMore || isStopLoadMore) {
    return;
  }

  dispatch({ type: types.START_LOADING_MORE_DIALOGS });

  API('/messages/getDialogs', { offset })
    .then(dialogs => {
      dispatch({
        type: types.COMPLETE_LOADING_MORE_DIALOGS,
        payload: dialogs
      });
    })
    .catch(() => dispatch({ type: types.ERROR_LOADING_DIALOGS }));
};

export const loadDialogs = (payload = {}) => dispatch => {
  const { refreshing } = payload;

  if (refreshing) {
    dispatch({ type: types.START_REFRESHING_DIALOGS });
  } else {
    dispatch({ type: types.START_LOADING_DIALOGS });
  }

  API('/messages/getDialogs')
    .then(dialogs => {
      dispatch(setBadge(dialogs.unread_count));
      dispatch({
        type: types.COMPLETE_LOADING_DIALOGS,
        payload: dialogs
      });
    })
    .catch(() => dispatch({ type: types.ERROR_LOADING_DIALOGS }));
};
