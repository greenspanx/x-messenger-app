import { types } from '../actions/BadgeActions';

export default function badge(state = 0, action) {
  switch (action.type) {
    case types.INCREMENT:
      return normalizeBadge(state + action.count);
    case types.DECREMENT:
      return normalizeBadge(state - action.count);
    case types.SET:
      return normalizeBadge(action.count);
    default:
      return state;
  }
}

function normalizeBadge(count) {
  return Math.max(count, 0);
}
