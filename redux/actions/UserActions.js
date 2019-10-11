import { AsyncStorage } from 'react-native';
import API, { setUserAPI } from '../../api';

export const types = {
  USER_LOGIN: 'USER/LOGIN',
  USER_SETUP: 'USER/SETUP',
  USER_UPDATE: 'USER/UPDATE'
};

export const userUpdate = updatedUser => (dispatch, getState) => {
  const user = getState().user;

  dispatch(
    userLogin({
      ...user,
      ...updatedUser
    })
  );
};

// set cookie 
export const userLogin = user => dispatch => {
  return AsyncStorage.setItem('User', JSON.stringify(user)).then(() => {
    dispatch(setupUser(user));
  });
};

export const setupUser = user => dispatch => {
  if (user) {
    setUserAPI(user);
    return dispatch({
      type: types.USER_SETUP,
      user
    });
  } else {
    return AsyncStorage.getItem('User').then(user => {
      if (user) {
        user = JSON.parse(user);
        setUserAPI(user);
        dispatch({
          type: types.USER_SETUP,
          user
        });
      }
    });
  }
};

export const userLogout = () => async dispatch => {
  const pushToken = await AsyncStorage.getItem('PushToken');
  if (pushToken) {
    await API('/account/unregisterDevice', {
      token: pushToken
    });
    AsyncStorage.removeItem('PushToken');
  }

  return API('/auth/deactivateToken')
    .then(async () => {
      await AsyncStorage.removeItem('User');
      dispatch(setupUser({}));
      dispatch({ type: 'RESET' });

      AsyncStorage.removeItem('isSyncContact');
    })
    .catch(() => {
      AsyncStorage.removeItem('User');
      AsyncStorage.removeItem('PushToken');
    });
};
