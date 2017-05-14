import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import isFunction from 'lodash/isFunction';

import 'styles/components/chart.scss';

const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

export const defaultOptions = {
  chart: {
    type: 'line'
  },
  credits: {
    enabled: false
  },
  title: {
    text: '',
    x: -20, //center
    style : {
      display : 'none'
    }
  },
  colors: [
    '#0080ec', '#29c664', '#ff5c3c', '#9f7bf9', '#ffb128', '#c849df',
    '#ff3d74', '#1fd8af', '#badd66', '#3cb3ff'
  ],
  chart: {
    events: {
      load() {
        this.showLoading();
        this.hasData = () => true;
      }
    }
  },
  xAxis: {
    categories: [],
    crosshair: {
      width: 1,
      color: '#D8D8D8',
      dashStyle: 'Solid'
    }
  },
  yAxis: {
    title: {
      text: ''
    },
    gridLineColor: '#E7EDF2'
  },
  lang: {
    loading: '加载中...'
  },
  loading: {
    style: {
      fontSize: '14px',
      color: '#59616e'
    }
  },
  tooltip: {
    valueSuffix: '',
    shared: true
  },
  plotOptions: {
    series: {
      marker: {
        fillColor: 'white',
        lineColor: null,
        lineWidth: 1,
        symbol: 'circle',
        radius: 3
      },
      states: {
        hover: {
          lineWidth: 2
        }
      }
    }
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    borderWidth: 0,
    enabled: false
  },
  series: [],
  exporting: {
    enabled: false
  },
  labelFormatter: name => name,
};

const propTypes = {
  className: PropTypes.string,
  options: PropTypes.object,
  height: PropTypes.number,
  series: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  categories: PropTypes.array,
  title: PropTypes.string,
  disableToggle: PropTypes.bool,
  hideLegend: PropTypes.bool,
  max: PropTypes.number,
};

const defaultProps = {
  options: {},
  height: 235,
  disableToggle: false,
};

class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: null,
      categories: [],
      options: {
        ...defaultOptions,
        ...this.props.options
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { max } = nextProps;

    if (this.props.series !== nextProps.series) {
      let series = cloneDeep(nextProps.series);
      const categories = cloneDeep(nextProps.categories);

      series = series ? this.formatSeries(series, max) : null;

      this.setState({ series, categories });
    }
    else if (this.props.series) {
      this.setState({
        series: this.formatSeries(
          cloneDeep(this.props.series),
          max
        )
      });
    }

    if (this.props.options !== nextProps.options) {
      this.setState({
        options: {
          ...defaultOptions,
          ...nextProps.options
        }
      });
    }
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.series !== this.props.series) {
      this.createChart(true);
    }
    // when visible changed
    else if (prevState.series !== this.state.series) {
      this.createChart();
    }
    else if (prevState.options !== this.state.options) {
      this.createChart(true);
    }
  }

  toggleVisible(index) {
    const { series } = this.state;

    series[index].visible = !series[index].visible;

    this.setState({ series: [...series] });
  }

  createChart(needSetCategories) {
    const { chart: chartContainer } = this.refs;

    if (this.chart) {
      this.chart.destroy();
    }

    const { height } = this.props;
    const { options } = this.state;

    const chart
    = this.chart
    = new Highcharts.Chart(merge(options, {
      chart: {
        renderTo: chartContainer,
        height
      }
    }));

    this.chart.showLoading();

    const { series, categories } = this.state;

    if (series == null) {
      return;
    }

    series.forEach((i, index) => {
      this.chart.addSeries(i);
    });

    if (series.length !== 0) {
      chart.hasData = () => true;
      chart.hideLoading();
    }
    else {
      chart.hasData = () => false;
      chart.hideLoading();
    }

    if (needSetCategories) {
      chart.xAxis[0].setCategories(categories);
    }

    chart.series.forEach(
      i => {
        const s = series.find(j => j.name === i.name);
        if (s) {
          s.color = i.color;
        }
      }
    );

    this.setState({ series });
  }

  formatSeries(series, max) {
    const { length } = series;

    series.forEach((i, index) => {
      i.zIndex = length - index;

      if (i.visible == null) {
        i.visible = true;
      }

      if (index == 0) {
        i.lineWidth = 3;
      }
    });

    return series;
  }

  render() {
    const { className, max, height, hideLegend } = this.props;
    const { series, options } = this.state;

    return (
      <div
      className={classNames(
        'chart',
        { [className]: !!className }
      )}
      >
      {series && series.length === 0 && (
        <div className="no-data">
          {isFunction(this.props.renderNoData)
            ? this.props.renderNoData()
            : (
              <div
                className="no-data-default"
                style={{
                  lineHeight: `${height}px`
                }}
              >
                没有数据
              </div>
            )
          }
        </div>
      )}

        <div
          className="chart-wrapper"
          ref="chart"
          style={{
            height: height || null
          }}
        />

      {series && series.length > 0 && !hideLegend && (
        <div className="chart-legend">
        {series.map((i, index) => (
          <label
            key={index}
            data-series-name={i.name}
            data-visible={i.visible}
            onClick={() => this.toggleVisible(index)}
          >
            <div
              className="checkbox"
              style={i.visible ? { backgroundColor: i.color } : {}}
            ></div>
          {options.labelFormatter ? options.labelFormatter(i.name) : i.name}
          </label>
        ))}
        </div>
      )}
      </div>
    );
  }
}

Chart.propTypes = propTypes;
Chart.defaultProps = defaultProps;

export default Chart;
