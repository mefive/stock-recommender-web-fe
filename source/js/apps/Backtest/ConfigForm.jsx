import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as actionTypes from 'config/actionTypes';

const defaultDataSource = {
  symbol: 'SH600036',
  strategy: 'MOVING_AVERAGE_CROSSOVER',
  scale: '240',
  datalen: 100,
};

class ConfigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: { ...defaultDataSource },
      error: {},
    };
    this.handleChange = ::this.handleChange;
    this.clearError = ::this.clearError;
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      dataSource: {
        ...this.state.dataSource,
        [name]: value,
      }
    });
  }

  clearError(field) {
    let error = { ...this.state.error }

    if (field && field in error) {
      delete error[field];
    }
    else {
      error = {};
    }

    this.setState({ error });
  }

  validate() {
    const { dataSource } = this.state;
    const error = {};

    if (!dataSource.symbol) {
      error.symbol = '股票代码必填';
    }

    if (!dataSource.datalen) {
      error.datalen = '条目数必填';
    }

    this.setState({ error });

    return Object.keys(error).length === 0;
  }

  render() {
    const { dataSource, error } = this.state;

    return (
      <div id="config-form">
        <div className="row">
          <div className="col col-12 col-xl-3">
            <div
              className={classNames(
                'form-group',
                { 'has-danger': 'symbol' in error }
              )}
            >
              <label htmlFor="symbol">股票代码</label>
              <input
                name="symbol"
                id="symbol"
                className="form-control"
                onChange={this.handleChange}
                value={dataSource.symbol}
                onFocus={() => this.clearError('symbol')}
              />
              {error.symbol && (
              <div className="form-control-feedback">
                {error.symbol}
              </div>
              )}
            </div>
          </div>
          <div className="col col-12 col-xl-3">
            <div className="form-group">
              <label htmlFor="strategy">交易策略</label>
              <select
                name="strategy"
                id="strategy"
                className="form-control"
                onChange={this.handleChange}
                value={dataSource.strategy}
              >
                <option value="MOVING_AVERAGE_CROSSOVER">移动均线交叉</option>
              </select>
            </div>
          </div>
          <div className="col col-12 col-xl-3">
            <div className="form-group">
              <label htmlFor="scale">单位</label>
              <select
                name="scale"
                id="scale"
                className="form-control"
                onChange={this.handleChange}
                value={dataSource.scale}
              >
                <option value="240">日k</option>
                <option value="1200">周k</option>
              </select>
            </div>
          </div>
          <div className="col col-12 col-xl-3">
            <div
              className={classNames(
                'form-group',
                { 'has-danger': 'datalen' in error }
              )}
            >
              <label htmlFor="datalen">条目数</label>
              <input
                name="datalen"
                id="datalen"
                className="form-control"
                onChange={this.handleChange}
                value={dataSource.datalen}
                onFocus={() => this.clearError('datalen')}
              />
              {error.datalen && (
              <div className="form-control-feedback">
                {error.datalen}
              </div>
              )}
            </div>
          </div>
        </div>

        <div className="row form-group">
          <div className="col">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (this.validate()) {
                  this.props.run(dataSource);
                }
              }}
            >
              运行
            </button>
          </div>
        </div>
      </div>
    );
  } 
}

const mapDispatchToProps = (dispatch) => ({
  run: data => dispatch({
    type: actionTypes.RUN_BACKTEST,
    payload: data,
  }),
});

export default connect(null, mapDispatchToProps)(ConfigForm);
