import { combineReducers } from 'redux';

import query from './query';
import kline from './kline';
import trades from './trades';
import result from './result';

export default combineReducers({
  query,
  kline,
  trades,
  result,
});
