import React from 'react';
import { connect } from 'react-redux';
import EChart from 'echarts-for-react';

class Kline extends React.Component {
  render() {
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
                start: 50,
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
              data: this.props.categoryData,
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
            categoryData: this.props.categoryData,
            series: this.props.series,
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { kline } = state.backtest;

  return {
    isFetching: kline.isFetching,
    categoryData: kline.data.categoryData,
    series: kline.data.series,
    symbol: kline.data.symbol,
  }
}

export default connect(mapStateToProps)(Kline);
