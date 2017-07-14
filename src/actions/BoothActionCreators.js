import {
  ADVANCE,
  BOOTH_SKIP,
  LOAD_HISTORY_START, LOAD_HISTORY_COMPLETE
} from '../constants/actionTypes/booth';
import { flattenPlaylistItem } from './PlaylistActionCreators';
import { get, post } from './RequestActionCreators';

import { historyIDSelector, isCurrentDJSelector } from '../selectors/boothSelectors';
import { currentPlaySelector } from '../selectors/roomHistorySelectors';
import { usersSelector } from '../selectors/userSelectors';
import loadEntities from '../utils/loadEntities';
// import mergeIncludedModels from '../utils/mergeIncludedModels';

const normalizeHistoryEntry = entry => ({
  _id: entry._id || entry.historyID,
  user: entry.user._id,
  media: {
    ...entry.media,
    media: entry.media.media._id
  },
  playedAt: new Date(entry.timestamp || entry.playedAt).toUTCString(),
  upvotes: entry.upvotes || [],
  downvotes: entry.downvotes || [],
  favorites: entry.favorites || []
});

export function advanceToEmpty() {
  return (dispatch, getState) => {
    dispatch({
      type: ADVANCE,
      payload: null,
      meta: { previous: currentPlaySelector(getState()) }
    });
  };
}

/**
 * Set the current song and DJ.
 */
export function advance(nextBooth) {
  if (!nextBooth || !nextBooth.historyID) {
    return advanceToEmpty();
  }
  const {
    media, userID, historyID, playlistID, playedAt
  } = nextBooth;
  return (dispatch, getState) => {
    const user = usersSelector(getState())[userID];

    const historyEntry = {
      userID,
      historyID,
      playlistID,
      user,
      media: flattenPlaylistItem(media),
      timestamp: playedAt
    };

    dispatch({
      type: ADVANCE,
      payload: historyEntry,
      meta: {
        previous: currentPlaySelector(getState()),
        entities: {
          media: { [media.media._id]: media.media },
          historyEntries: { [historyID]: normalizeHistoryEntry(historyEntry) }
        }
      }
    });
  };
}

export function skipSelf(opts = {}) {
  const remove = !!opts.remove;
  return (dispatch, getState) => {
    if (isCurrentDJSelector(getState())) {
      return dispatch(post('/booth/skip', { remove }));
    }
    return Promise.reject(new Error('You\'re not currently playing.'));
  };
}

export function skipped({ userID, moderatorID, reason }) {
  return (dispatch, getState) => {
    const users = usersSelector(getState());
    dispatch({
      type: BOOTH_SKIP,
      payload: {
        user: users[userID],
        moderator: users[moderatorID],
        reason,
        timestamp: Date.now()
      }
    });
  };
}

export function loadHistoryStart() {
  return { type: LOAD_HISTORY_START };
}

export function loadHistoryComplete(response) {
  return (dispatch, getState) => {
    const currentHistoryID = historyIDSelector(getState());
    const { meta } = response;
    let playHistory = response.data; // mergeIncludedModels(response);
    if (playHistory[0] && playHistory[0]._id === currentHistoryID) {
      playHistory = playHistory.slice(1);
    }
    dispatch({
      type: LOAD_HISTORY_COMPLETE,
      payload: playHistory,
      meta: {
        page: Math.floor(meta.offset / meta.pageSize),
        size: meta.pageSize,
        entities: loadEntities(response, 'historyEntries')
      }
    });
  };
}

export function loadHistory() {
  return get('/booth/history', {
    onStart: loadHistoryStart,
    onComplete: loadHistoryComplete
  });
}
