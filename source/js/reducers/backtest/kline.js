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

function getPointColor(type) {
  switch (type) {
    case 0: {
      return '#54BA53';
    }

    case 1: {
      return '#DB514A';
    }

    case 2: {
      return '#F1AF3C';
    }
  }
}

export default handleActions({
  [actionTypes.RUN_BACKTEST]: (state) => ({ ...state, isFetching: true }),

  [actionTypes.UPDATE_BACKTEST_KLINE]:
    (state, { payload }) => {
      const { kline, query, trades } = payload;
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
        markPoint: {
          data: (() => {
            return trades.map(({ order }) => ({
              type: order.type,
              price: order.price,
              coord: [order.date, +order.price],
              symbolRotate: order.type === 1 ? 0 : 180,
              itemStyle: {
                normal: {
                  color: getPointColor(order.type)
                }
              }
            }))
          })()
        }
      });

      series.push({
        name: 'MA5',
        type: 'line',
        smooth: true,
        data: kline.map((k) => k.maPrice5)
      });

      series.push({
        name: 'MA10',
        type: 'line',
        smooth: true,
        data: kline.map((k) => k.maPrice10)
      });

      series.push({
        name: 'MA30',
        type: 'line',
        smooth: true,
        data: kline.map((k) => k.maPrice30)
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
