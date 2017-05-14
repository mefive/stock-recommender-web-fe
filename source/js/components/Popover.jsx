import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import 'styles/components/popover.scss';

class Popover extends Component {
  static propTypes = {
    className: PropTypes.string,
    placement: PropTypes.string,
    anchorRect: PropTypes.object,
    containerReact: PropTypes.object,
    offset: PropTypes.number
  }

  static defaultProps = {
    placement: 'top',
    offset: 10
  }

  constructor(props) {
    super(props);

    this.state = {
      style: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.anchorRect !== this.props.anchorRect
      || prevProps.containerRect !== this.props.containerRect
    ) {
      this.place();
    }
  }

  place() {
    const {
      containerRect,
      anchorRect,
      placement,
      offset
    } = this.props;

    const anchorHeight = anchorRect.height;
    const anchorWidth = anchorRect.width;

    const popoverRect
      = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const popoverHeight = popoverRect.height;
    const popoverWidth = popoverRect.width;

    let left = 0;
    let top = 0;
    let marginLeft = 0;
    let marginTop = 0;

    switch (placement) {
      case 'top': {
        left = anchorRect.left + (anchorWidth / 2) - containerRect.left;
        marginLeft = -(popoverWidth / 2);
        marginTop = -offset;
        top = anchorRect.top - popoverHeight - 0 - containerRect.top;
        break;
      }

      case 'topRight': {
        left = anchorRect.left + anchorWidth - popoverWidth - containerRect.left;
        marginTop = -offset;
        top = anchorRect.top - popoverHeight - containerRect.top;
        break;
      }

      case 'topLeft': {
        left = anchorRect.left;
        marginTop = -offset;
        top = anchorRect.top - popoverHeight - containerRect.top;
        break;
      }

      case 'bottom': {
        left = anchorRect.left + (anchorWidth / 2) - containerRect.left;
        marginLeft = -(popoverWidth / 2);
        marginTop = offset;
        top = anchorRect.top + anchorHeight - containerRect.top;
        break;
      }

      case 'right': {
        left = anchorRect.left + anchorWidth + offset;
        marginLeft = 0;
        marginTop = 0;
        top = anchorRect.top - containerRect.top - (popoverHeight / 2) + (anchorHeight / 2);
        break;
      }

      case 'rightTop': {
        left = anchorRect.left + anchorWidth + offset;
        marginLeft = 0;
        marginTop = 0;
        top = anchorRect.top - containerRect.top;
        break;
      }

      case 'left': {
        left = anchorRect.left - offset - popoverWidth - containerRect.left;
        marginLeft = 0;
        marginTop = 0;
        top = anchorRect.top - containerRect.top - (popoverHeight / 2) + (anchorHeight / 2);
        break;
      }
    }

    this.setState({
      style: { left, top, marginLeft, marginTop }
    });
  }

  render() {
    const {
      className,
      placement,
      children
    } = this.props;

    const { style } = this.state;

    return (
      <div
        className={
          classNames(
            'popover',
            `place-${placement}`,
            { [className]: !!className }
          )
        }
        style={{
          ...style,
          zIndex: 999,
        }}
      >
        {children}
      </div>
    );
  }
}

Popover.placement = {
  TOP: 'top',
  'TOP_RIGHT': 'topRight',
  'TOP_LEFT': 'topLeft',
  BOTTOM: 'bottom',
  RIGHT: 'right',
  'RIGHT_TOP': 'rightTop',
  LEFT: 'left'
};

export default Popover;
