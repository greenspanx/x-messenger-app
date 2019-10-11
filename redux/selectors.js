import { createSelector } from 'reselect';
import { initialConversation } from './reducers/ConversationsReducer';

const selectConversations = state => state.conversations;
const selectRecipientID = (state, recipient_id) => recipient_id;

export const makeUniqueConversationSelector = () =>
  createSelector(
    [selectConversations, selectRecipientID],
    (conversations, recipient_id) =>
      conversations[recipient_id] || initialConversation
  );
