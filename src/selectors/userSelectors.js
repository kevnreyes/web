import { createSelector } from 'reselect';
import naturalCmp from 'natural-compare';

const authSelector = state => state.auth;

const entitiesSelector = state => state.entities;
const usersBaseSelector = state => state.users;
export const usersSelector = createSelector(
  entitiesSelector,
  entities => entities.users
);
const onlineUsersSelector = createSelector(
  usersBaseSelector,
  usersSelector,
  (users, userEntities) => users.onlineUsers.map(id => userEntities[id])
);

export const authErrorSelector = createSelector(authSelector, auth => auth.error);
export const currentUserSelector = createSelector(authSelector, auth => auth.user);
export const isLoggedInSelector = createSelector(currentUserSelector, Boolean);
export const tokenSelector = createSelector(authSelector, auth => auth.jwt);

const currentRoleSelector = createSelector(
  currentUserSelector,
  user => (user ? user.role : 0)
);

export const isModeratorSelector = createSelector(
  currentRoleSelector,
  role => role >= 2
);

export const isManagerSelector = createSelector(
  currentRoleSelector,
  role => role >= 3
);

function compareUsers(a, b) {
  if (a.role > b.role) {
    return -1;
  }
  if (a.role < b.role) {
    return 1;
  }
  return naturalCmp(a.username.toLowerCase(), b.username.toLowerCase());
}

export const userListSelector = createSelector(
  onlineUsersSelector,
  users => users.sort(compareUsers)
);

export const userCountSelector = createSelector(
  onlineUsersSelector,
  users => users.length
);

export const guestCountSelector = createSelector(
  usersBaseSelector,
  base => base.guests
);

export const listenerCountSelector = createSelector(
  userCountSelector,
  guestCountSelector,
  (users, guests) => users + guests
);
