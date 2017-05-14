import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import 'styles/components/select.scss';

import Trigger from './Trigger';
import Popover from './Popover';

const propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  optionsHeight: PropTypes.number,
  getPopoverContainer: PropTypes.func,
  title: PropTypes.string,
  defaultTitle: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

const defaultProps = {
  optionsHeight: 200,
  defaultTitle: '请选择',
  onChange: () => null,
  placement: 'bottom'
};

class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      triggerWidth: 0,
      multipleSelection: []
    };

    this.confirmSelection = ::this.confirmSelection;
  }

  componentDidMount() {
    this.setState({
      triggerWidth:
        this.refs.trigger.getBoundingClientRect().width
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.active && !prevState.active) {
      if (this.props.multiple) {
        this.setState({
          multipleSelection: this.props.value || []
        });
      }
    }
  }

  changeActive(active) {
    this.setState({ active });
  }

  getTitle() {
    const { value, options, multiple, getTitle, defaultTitle } = this.props;

    let option, title;

    if (multiple && value) {
      option = options.filter(i => value.indexOf(i.value) !== -1);

      title = option.map(i => i.title).join(',');
    }
    else {
      option = options.find(i => i.value === value);
      title = option ? option.title : '';
    }

    return title || defaultTitle;
  }

  select(value) {
    const { value: old, onChange, multiple } = this.props;

    if (!multiple) {
      if (value !== old) {
        onChange(value);
      }

      this.changeActive(false);
    }
    else {
      const multipleSelection = [...this.state.multipleSelection];
      const index = multipleSelection.indexOf(value);

      if (index === -1) {
        const { max } = this.props;
        if (!max || multipleSelection.length < max) {
          multipleSelection.push(value);
        }
      }
      else {
        multipleSelection.splice(index, 1);
      }

      this.setState({ multipleSelection });
    }
  }

  confirmSelection() {
    const { multipleSelection } = this.state;

    if (!isEqual(multipleSelection, this.props.value)) {
      this.props.onChange([...multipleSelection]);
    }

    this.setState({ multipleSelection: [] });
    this.changeActive(false);
  }

  render() {
    const {
      className,
      width,
      multiple,
      optionsHeight,
      options,
      value,
      title,
      disabled
    } = this.props;
    const { active, triggerWidth } = this.state;

    return (
      <Trigger
        active={active}
        disabled={disabled}
        enterClassName={this.props.placement === 'bottom'
          ? 'slide-down-in': 'slide-up-in'}
        leaveClassName={this.props.placement === 'bottom'
          ? 'slide-down-out': 'slide-up-out'}
        popover={
          <Popover
            placement={this.props.placement}
            offset={5}
            className={classNames(
              'select-popup'
            )}
          >
            <div
              style={{
                height: multiple ? optionsHeight : null,
                maxHeight: multiple ? null : optionsHeight,
                width: triggerWidth
              }}
            >
              <div
                className="wrapper"
                style={{
                  height: multiple ? optionsHeight - 32 : null,
                  maxHeight: multiple ? null : optionsHeight
                }}
              >
                <ul>
                {options && options.map(i => {
                  return (
                  <li
                    key={i.value}
                    className={classNames(
                      { 'active': multiple
                        ? this.state.multipleSelection.indexOf(i.value) !== -1
                        : i.value === value }
                    )}
                    onClick={() => this.select(i.value)}
                  >
                  {multiple && i.value === value && (
                    <i className="icon icon-check"></i>
                  )}

                  {i.title}
                  </li>
                  );
                })}
                </ul>
              </div>

            {multiple && (
              <div className="actions">
                <div
                  className="btn btn-sm btn-primary"
                  onClick={this.confirmSelection}
                >
                  确定
                </div>
              </div>
            )}
            </div>
          </Popover>
        }
        onActiveChange={::this.changeActive}
      >
        <div
          className={classNames(
            'select',
            { [className]: !!className }
          )}
          style={{
            width: width || null
          }}
        >
          <div
            className={classNames(
              'select-trigger',
              { 'active': active }
            )}
            ref="trigger"
          >
            {title || this.getTitle()}

            <div className="trigger-icon">
              <i className="icon icon-caret-down" />
            </div>
          </div>
        </div>
      </Trigger>
    );
  }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
