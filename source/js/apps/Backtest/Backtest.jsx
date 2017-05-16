import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConfigForm from './ConfigForm';
import Kline from './Kline';
import Trades from './Trades';

class Backtest extends React.Component {
  canShowResult() {
    return !!this.props.result;
  }

  render() {
    const { result } = this.props;

    return (
      <div id="backtest" style={{ paddingTop: 8 }}>
        <h1>回测</h1>

        <div className="card">
          <div className="card-header">
            条件
          </div>

          <div className="card-block">
            <ConfigForm />
          </div>
        </div>

        {this.canShowResult() && (
        <div className="card mt-3">
          <div className="card-header">
            运行结果
          </div>
          <div className="card-block">
            <h4 className="card-title">收益</h4>
            <p className="card-text">{`${(result.returns * 100).toFixed(2)}%`}</p>
            <h4 className="card-title">总资产</h4>
            <p className="card-text">{result.asset}</p>
            <h4 className="card-title">现金</h4>
            <p className="card-text">{result.cash}</p>
          </div>
        </div>
        )}

        {this.canShowResult() && (
        <div className="card mt-3">
          <div className="card-header">
            K线图
          </div>

          <div className="card-block">
            <Kline />
          </div>
        </div>
        )}

        {this.canShowResult() && (
        <div className="card mt-3">
          <div className="card-header">
            交易明细
          </div>

          <div className="card-block">
            <Trades />
          </div>
        </div>
        )}

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  result: state.backtest.result,
});

export default connect(mapStateToProps)(Backtest);
