import { handleActions } from 'redux-actions';

import * as actionTypes from 'config/actionTypes';

const initialState = {
  symbol: 'SH600036',
  strategy: 'MOVING_AVERAGE_CROSSOVER',
  scale: '240',
  datalen: 100,
};

export default handleActions({
  [actionTypes.UPDATE_BACKTEST_QUERY]: (state, { payload }) =>
    ({ ...state, ...payload }),
}, initialState);
