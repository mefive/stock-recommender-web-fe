import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM, {
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode
} from 'react-dom';

import Portal from './Portal';
import Animate from './Animate';

const propTypes = {
  popover: PropTypes.element,
  active: PropTypes.bool,
  onActiveChange: PropTypes.func,
  disabled: PropTypes.bool,
  enterClassName: PropTypes.string,
  leaveClassName: PropTypes.string,
  action: PropTypes.string
};

const defaultProps = {
  onActiveChange: () => null,
  action: 'click'
};

class Trigger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      anchorRect: {},
      containerRect: {}
    }

    this.tryToggle = ::this.tryToggle;
    this.toggle = ::this.toggle;
    this.active = ::this.active;
    this.deactive = ::this.deactive;
  }

  componentDidUpdate(prevProps, prevState) {
    const active = this.props.active == null
      ? this.state.active : this.props.active;

    const prevActive = prevProps.active == null
      ? prevState.active : prevProps.active;

    const { action } = this.props;

    if (active && !prevActive) {
      // show
      this.setState({
        anchorRect:
          ReactDOM.findDOMNode(this).getBoundingClientRect()
      });

      if (action === 'click') {
        document.addEventListener('click', this.tryToggle);
      }
    }
    else if (!active && prevActive) {
      // hide
      if (action === 'click') {
        document.removeEventListener('click', this.tryToggle);
      }
    }
  }

  componentWillUnmount() {
    const { action } = this.props;

    if (action === 'click') {
      document.removeEventListener('click', this.tryToggle);
    }
  }

  tryToggle(e) {
    if (
      !ReactDOM.findDOMNode(this.refs.popover)
        .contains(e.target)
    ) {
      this.toggle();
    }
  }

  toggle() {
    if (this.props.disabled) {
      return;
    }

    let active = this.props.active;

    if (active == null) {
      active = this.state.active;
      this.setState({ active: !active });
    }

    this.props.onActiveChange(!active);
  }

  active() {
    if (this.props.disabled) {
      return;
    }

    const { active } = this.props;

    if (active == null) {
      this.setState({ active: true });
    }
    else {
      this.props.onActiveChange(true);
    }
  }

  deactive() {
    if (this.props.disabled) {
      return;
    }

    const { active } = this.props;

    if (active == null) {
      this.setState({ active: false });
    }
    else {
      this.props.onActiveChange(false);
    }
  }

  render() {
    const active = this.props.active == null
      ? this.state.active : this.props.active;

    const { enterClassName, leaveClassName, action } = this.props;

    const { anchorRect, containerRect } = this.state;

    const child = React.Children.only(this.props.children);

    return React.createElement(
      child.type,
      {
        ...child.props,
        onClick: action === 'click' ? this.toggle : undefined,
        onMouseEnter: action === 'hover' ? this.active : undefined,
        onMouseLeave: action === 'hover' ? this.deactive : undefined
      },
      ...React.Children.toArray(child.props.children),
      <Animate
        enterClassName={enterClassName}
        leaveClassName={leaveClassName}
        enterDuration={enterClassName ? undefined : 0}
        leaveDuration={leaveClassName ? undefined : 0}
      >
      {active && (
        <Portal
          onContainerChange={container => this.setState({
            containerRect: container.parentNode.getBoundingClientRect()
          })}
        >
          {React.cloneElement(
            this.props.popover,
            {
              containerRect,
              anchorRect,
              ref: 'popover'
            }
          )}
        </Portal>
      )}
      </Animate>
    );
  }
}

Trigger.propTypes = propTypes;
Trigger.defaultProps = defaultProps;

export default Trigger;
