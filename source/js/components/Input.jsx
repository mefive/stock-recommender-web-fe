import React, { Component } from 'react'
import PropTypes from 'prop-types';

function isCheckable(type) {
  return ['checkbox', 'radio'].indexOf(type) !== -1;
}

function isFile(type) {
  return type === 'file';
}

class Input extends Component {
  render() {
    const { type, value, onChange, format } = this.props;

    const newProps = { ...this.props };

    if (!type) {
      newProps.type = 'text';
    }

    return (
      <input
        {...newProps}
        onChange={(e) => {
          let value;
          const { target } = e;

          if (isCheckable(type)) {
            value = target.checked;
          }
          else if (isFile(type)) {
            value = target.files
              ? target.files[0]
              // ie9
              : target.value;
          }
          else {
            value = target.value;
          }

          if (typeof format === 'function') {
            value = format(value);
          }

          onChange(value, e);
        }}
        value={isCheckable(type) ? '' : (value == null ? '' : value)}
        checked={isCheckable(type) ? value : null }
      />
    );
  }
}

Input.defaultProps = {
  onChange: () => null
};

export default Input;
