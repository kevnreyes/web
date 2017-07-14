import except from 'except';
import { createSelector } from 'reselect';
import {
  historyIDSelector, mediaSelector, startTimeSelector, djSelector
} from './boothSelectors';
import {
  currentUserSelector,
  usersSelector
} from './userSelectors';
import { currentVotesSelector } from './voteSelectors';

const byTimestamp = (a, b) => (a.playedAt < b.playedAt ? 1 : -1);

const baseSelector = state => state.roomHistory;
const mediaEntitiesSelector = state => state.entities.media;
const historyEntriesSelector = state => state.entities.historyEntries;

export const roomHistorySelector = createSelector(
  baseSelector,
  usersSelector,
  historyEntriesSelector,
  mediaEntitiesSelector,
  (history, users, historyEntries, mediaEntities) => history
    .map(id => historyEntries[id])
    .map(entry => ({
      ...except(entry, 'downvotes', 'upvotes', 'favorites'),
      media: {
        ...mediaEntities[entry.media.media],
        ...entry.media
      },
      stats: {
        downvotes: entry.downvotes,
        upvotes: entry.upvotes,
        favorites: entry.favorites
      },
      user: users[entry.user],
      playedAt: new Date(entry.playedAt).getTime()
    }))
    .sort(byTimestamp)
);

const addOwnVoteProps = id => entry => ({
  ...entry,
  stats: {
    ...entry.stats,
    // No ID is provided for guest users.
    isDownvote: !!id && entry.stats.downvotes.indexOf(id) > -1,
    isFavorite: !!id && entry.stats.favorites.indexOf(id) > -1,
    isUpvote: !!id && entry.stats.upvotes.indexOf(id) > -1
  }
});

export const currentPlaySelector = createSelector(
  currentUserSelector,
  historyIDSelector,
  mediaSelector,
  startTimeSelector,
  djSelector,
  currentVotesSelector,
  (user, historyID, media, timestamp, dj, stats) => {
    if (!historyID) {
      return null;
    }
    const entry = {
      _id: historyID,
      user: dj,
      media,
      playedAt: timestamp,
      stats
    };
    return addOwnVoteProps(user ? user._id : null)(entry);
  }
);

export const roomHistoryWithVotesSelector = createSelector(
  roomHistorySelector,
  currentUserSelector,
  currentPlaySelector,
  (history, user, current) => {
    const roomHistory = history.map(addOwnVoteProps(user ? user._id : null));
    if (current) {
      roomHistory.unshift(current);
    }
    return roomHistory;
  }
);
