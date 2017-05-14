import React, { Component } from 'react';

import Trigger from './Trigger';
import Popover from './Popover';

import 'styles/components/tooltip.scss';

const defaultProps = {
  title: null,
  placement: Popover.placement.TOP
};

class Tooltip extends Component {
  render() {
    return (
      <Trigger
        action="hover"
        popover={(
          <Popover
            className="tooltip"
            placement={this.props.placement}
          >
            {this.props.title}
          </Popover>
        )}
        enterClassName="scale-in"
        leaveClassName="scale-out"
        enterDuration={100}
        leaveDuration={100}
      >
        {this.props.children}
      </Trigger>
    );
  }
}

Tooltip.defaultProps = defaultProps;

export default Tooltip;
