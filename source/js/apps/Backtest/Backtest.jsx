import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConfigForm from './ConfigForm';
import Kline from './Kline';

class Backtest extends React.Component {
  canShowResult() {
    return Object.keys(this.props.kline.data).length > 0;
  }

  render() {
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
            K线图
          </div>

          <div className="card-block">
            <Kline />
          </div>
        </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  kline: state.backtest.kline,
});

export default connect(mapStateToProps)(Backtest);
