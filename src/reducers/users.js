import { combineReducers } from 'redux';

import {
  INIT_STATE
} from '../constants/actionTypes/auth';
import {
  LOAD_ONLINE_USERS,
  USER_JOIN,
  USER_LEAVE,
  RECEIVE_GUEST_COUNT
} from '../constants/actionTypes/users';

function guestsReducer(state = 0, action = {}) {
  if (action.type === INIT_STATE) {
    return action.payload.guests;
  }
  if (action.type === RECEIVE_GUEST_COUNT) {
    return action.payload.guests;
  }
  return state;
}

function onlineUsersReducer(state = [], action = {}) {
  const { type, payload } = action;
  switch (type) {
  case LOAD_ONLINE_USERS:
    // this is merged in instead of replacing the state, because sometimes the
    // JOIN event from the current user comes in before the LOAD event, and then
    // the current user is sometimes excluded from the state. it looks like this
    // approach could cause problems, too, though.
    // TODO maybe replace state instead anyway and merge in the current user?
    return state.concat(payload.users.map(user => user._id));
  case USER_JOIN:
    return state.concat([ payload.user._id ]);
  case USER_LEAVE:
    return state.filter(uid => payload.userID !== uid);
  default:
    return state;
  }
}

const reduce = combineReducers({
  guests: guestsReducer,
  onlineUsers: onlineUsersReducer
});

export default reduce;
