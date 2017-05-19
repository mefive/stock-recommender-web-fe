import React from 'react';
import { connect } from 'react-redux';

class Table extends React.Component {
  render() {
    const { dataSource, columns } = this.props;

    return (
      <table className="table table-striped table-bordered table-hover">
        <thead className="thead-inverse">
          <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.title}</th>
          ))}
          </tr>
        </thead>

        <tbody>
        {dataSource.map((record, index) => (
          <tr key={index}>
          {columns.map((column) => (
            <td key={column.key}>
              {column.render
                ? column.render(record, index)
                : record[column.key]
              }
            </td>
          ))}
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}

class Trades extends React.Component {
  render() {
    const { trades } = this.props;

    return (
      <div id="trades">
        <Table
          columns={[
            {
              key: 'date',
              title: '交易时间',
            },
            {
              key: 'type',
              title: '交易类型',
              render: (record) => {
                switch (record.type) {
                  case 0: {
                    return '买入';
                  }

                  case 1: {
                    return '卖出';
                  }

                  case 2: {
                    return '更新持仓点';
                  }
                }
              }
            },
            {
              key: 'returns',
              title: '收益',
              render: (reocrd) => `${(reocrd.returns * 100).toFixed(2)}%`,
            },
            {
              key: 'price',
              title: '成交价格',
            },
            {
              key: 'amount',
              title: '成交数量',
            },
            {
              key: 'asset',
              title: '总资产',
            },
            {
              key: 'cash',
              title: '现金',
            },
          ]}
          dataSource={this.props.trades} 
        /> 
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  trades: state.backtest.trades.data,
  isFetching: state.backtest.trades.isFetching
});

export default connect(mapStateToProps)(Trades);

