import { handleActions } from 'redux-actions';

import * as actionTypes from 'config/actionTypes';

const initialState = {
  isFetching: false,
  data: {},
};

function getScaleText(scale) {
  switch (+scale) {
    case 240: {
      return '日K';
    }

    case 1200: {
      return '周K';
    }
  }
}

export default handleActions({
  [actionTypes.RUN_BACKTEST]: (state) => ({ ...state, isFetching: true }),

  [actionTypes.UPDATE_KLINE]:
    (state, { payload }) => {
      const { kline, query } = payload;
      const { symbol, scale } = query;

      const categoryData = kline.map(i => i.day);

      const series = [];
      
      series.push({
        name: getScaleText(scale),
        type: 'candlestick',
        data: kline.map((k) => [
          +k.open,
          +k.close,
          +k.low,
          +k.high,
        ]),
      });

      return {
        isFetching: false,
        data: {
          categoryData,
          series,
          symbol,
        }
      };
    },
}, initialState);
