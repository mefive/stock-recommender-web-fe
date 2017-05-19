import { put, takeLatest, select } from 'redux-saga/effects';

import * as actionTypes from 'config/actionTypes';
import service from 'utils/service';

function* runBacktest({ payload }) {
  const state = yield select();

  const { symbol, strategy, scale, datalen } = state.backtest.query;

  try {
    const data = yield service.get(
      '/api/backtest',
      { symbol, strategy, scale, datalen },
    );

    yield [
      put({
        type: actionTypes.UPDATE_BACKTEST_KLINE,
        payload: data.kline,
      }),

      put({
        type: actionTypes.UPDATE_BACKTEST_TRADES,
        payload: data.trades,
      }),

      put({
        type: actionTypes.UPDATE_BACKTEST_RESULT,
        payload: data.portfolio,
      }),
    ]
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
