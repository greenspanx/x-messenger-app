export const types = {
  INCREMENT: 'BADGE/INCREMENT',
  DECREMENT: 'BADGE/DECREMENT',
  SET: 'BADGE/SET'
};

export const setBadge = count => ({
  type: types.SET,
  count
});

export const incrementBadge = count => ({
  type: types.INCREMENT,
  count
});

export const decrementBadge = count => ({
  type: types.DECREMENT,
  count
});
