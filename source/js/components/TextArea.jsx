import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextArea extends Component {
  render() {
    return (
      <textArea
        {...this.props}
        onChange={e => this.props.onChange(e.target.value, e)}
      />
    )
  }
}

TextArea.defaultProps = {
  onChange: () => null
};

export default TextArea;
