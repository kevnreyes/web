const initialState = {};

export default function reducer(state = initialState, action = {}) {
  if (!(action && action.meta && action.meta.entities)) {
    return state;
  }

  const updates = action.meta.entities;
  const nextState = { ...state };
  Object.keys(updates).forEach((type) => {
    if (type === 'update') return;

    nextState[type] = {
      ...nextState[type],
      ...updates[type]
    };
  });

  if (updates.update) {
    const { update } = updates;
    Object.keys(update).forEach((type) => {
      nextState[type] = { ...nextState[type] };
      Object.keys(update[type]).forEach((id) => {
        nextState[type][id] = {
          ...nextState[type][id],
          ...update[type][id]
        };
      });
    });
  }

  return nextState;
}
