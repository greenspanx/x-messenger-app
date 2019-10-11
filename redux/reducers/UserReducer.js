import { types } from '../actions/UserActions';

export default function user(state = {}, action) {
  switch (action.type) {
    case types.USER_SETUP:
      return {
        ...state,
        ...action.user
      };
    default:
      return state;
  }
}
