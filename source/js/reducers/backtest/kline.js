import { handleActions } from 'redux-actions';

import * as actionTypes from 'config/actionTypes';

const initialState = {
  isFetching: false,
  data: [],
};

export default handleActions({
  [actionTypes.RUN_BACKTEST]: (state) => ({ ...state, isFetching: true }),

  [actionTypes.UPDATE_BACKTEST_KLINE]: (state, { payload }) => ({ isFetching: false, data: [ ...payload ] }),
}, initialState);
