import { handleActions } from 'redux-actions';
import * as actionTypes from 'config/actionTypes';

const initialState = null;

export default handleActions({
  [actionTypes.UPDATE_BACKTEST_RESULT]: (state, { payload }) => payload,
}, initialState);
