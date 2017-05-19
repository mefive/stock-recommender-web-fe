import React from 'react';
import { connect } from 'react-redux';
import EChart from 'echarts-for-react';
import pureRender from 'pure-render-decorator';

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

@pureRender
class Kline extends React.Component {
  render() {
    const { kline, query, trades } = this.props;
    console.log({ kline, query, trades });
    const { scale, symbol } = query;

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
          return trades.map((order) => ({
            type: order.type,
            price: order.price,
            coord: [order.date, +order.price],
            // symbolRotate: order.type === 1 ? 0 : 180,
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

    return (
      <div id="kline">
        <EChart
          style={{ height: 600 }}
          option={{
            title: {
              text: this.props.symbol,
              left: 0
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            grid: {
              left: '10%',
              right: '10%',
              bottom: '15%'
            },
            dataZoom: [
              {
                type: 'inside',
                start: 0,
                end: 100
              },
              {
                show: true,
                type: 'slider',
                y: '90%',
                start: 50,
                end: 100
              }
            ],
            legend: {
              data: ['日K', 'MA5', 'MA10', 'MA30']
            },
            xAxis: {
              type: 'category',
              data: categoryData,
              scale: true,
              boundaryGap : false,
              axisLine: {onZero: false},
              splitLine: {show: false},
              splitNumber: 20,
              min: 'dataMin',
              max: 'dataMax'
            },
            yAxis: {
              scale: true,
              splitArea: {
                show: true
              }
            },
            categoryData,
            series,
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { kline, trades, query } = state.backtest;

  return {
    isFetching: kline.isFetching,
    query,
    kline: kline.data,
    trades: trades.data,
  };
}

export default connect(mapStateToProps)(Kline);
