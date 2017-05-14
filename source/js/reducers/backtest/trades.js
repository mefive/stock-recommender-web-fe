import { handleActions } from 'redux-actions';

import * as actionTypes from 'config/actionTypes';

const initialState = {
  isFetching: false,
  data: [],
};

export default handleActions({
  [actionTypes.RUN_BACKTEST]: (state) => ({ ...state, isFetching: true }),

  [actionTypes.UPDATE_TRADES]: (state, { payload }) => {
    const data = [];

    payload.forEach((trade) => data.push({ ...trade.order, ...trade.portfolio }));

    return {
      isFetching: false,
      data,
    };
  }
}, initialState);
