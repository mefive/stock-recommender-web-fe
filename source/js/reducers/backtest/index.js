import { combineReducers } from 'redux';

import kline from './kline';
import trades from './trades';
import result from './result';

export default combineReducers({
  kline,
  trades,
  result,
});
