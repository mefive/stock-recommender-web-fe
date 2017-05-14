import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import 'styles/components/datePicker.scss';

import Trigger from './Trigger';
import Calendar from './Calendar';
import Popover from './Popover';

class DatePicker extends Component {
  static propTypes = {
    className: PropTypes.string,
    width: PropTypes.number,
    value: PropTypes.string,
    onChange: PropTypes.func,
    min: PropTypes.string,
    max: PropTypes.string,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    value: moment().format('YYYY-MM-DD'),
    onChange: () => null
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false
    };
  }

  select(value) {
    if (value !== this.props.value) {
      this.props.onChange(value);
    }

    this.changeActive(false)
  }

  changeActive(active) {
    this.setState({ active });
  }

  render() {
    const {
      className,
      width,
      value,
      onChange,
      min,
      max,
      disabled
    } = this.props;
    const { active } = this.state;

    return (
      <div
        className={classNames(
          'date-picker',
          { [className]: !!className }
        )}
        style={{
          width: width || null
        }}
      >
        <Trigger
          disabled={disabled}
          enterClassName="slide-down-in"
          leaveClassName="slide-down-out"
          active={active}
          popover={(
            <Popover
              placement="bottom"
              className="date-picker-popover"
              offset={15}
            >
              <Calendar
                value={value}
                onChange={::this.select}
                min={min}
                max={max}
              />
            </Popover>
          )}
          onActiveChange={::this.changeActive}
        >
          <span>
            <input
              type="text"
              value={value}
              readOnly
              style={{ width: '100%' }}
            />
          </span>
        </Trigger>
      </div>
    );
  }
}

export default DatePicker;
