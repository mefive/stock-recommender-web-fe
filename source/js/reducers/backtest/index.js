import { combineReducers } from 'redux';

import kline from './kline';
import trades from './trades';

export default combineReducers({
  kline,
  trades,
});
