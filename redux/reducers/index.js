import { combineReducers } from 'redux';
import DialogsReducer from './DialogsReducer';
import ConversationsReducer from './ConversationsReducer';
import UserReducer from './UserReducer';
import BadgeReducer from './BadgeReducer';

const appReducer = combineReducers({
  dialogs: DialogsReducer,
  conversations: ConversationsReducer,
  user: UserReducer,
  badge: BadgeReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
