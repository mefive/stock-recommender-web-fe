import { put, takeLatest, select } from 'redux-saga/effects';

import * as actionTypes from 'config/actionTypes';
import service from 'utils/service';

function* runBacktest({ payload }) {
  const { symbol, strategy, scale, datalen } = payload;

  try {
    const data = yield service.get(
      '/api/backtest',
      { symbol, strategy, scale, datalen },
    );

    yield put({
      type: actionTypes.UPDATE_KLINE,
      payload: {
        query: {
          symbol,
          scale,
        },
        kline: data.kline,
      }
    });

    yield put({
      type: actionTypes.UPDATE_TRADES,
      payload: data.trades,
    });
  }
  catch (e) {
    console.log(e);
  }
}

export default function* () {
  yield [
    takeLatest(actionTypes.RUN_BACKTEST, runBacktest)
  ];
}
