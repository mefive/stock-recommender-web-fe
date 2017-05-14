import React, { Component } from 'react';

import 'styles/components/radioGroup.scss';

const defaultProp = {
  options: [],
  onChange: () => null,
};

class RadioGroup extends Component {
  render() {
    return (
      <div className="radio-group">
      {this.props.options.map(option => (
        <label key={option.value}>
          <input
            type="radio"
            checked={option.value === this.props.value}
            onChange={e => {
              this.props.onChange(option.value, e);
            }}
          />
          <span>
            {option.title}
          </span>
        </label>
      ))}
      </div>
    );
  }
}

RadioGroup.defaultProp = defaultProp;

export default RadioGroup;
