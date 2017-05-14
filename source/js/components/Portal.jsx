import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM, {
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode
} from 'react-dom';
import classNames from 'classnames';

class Portal extends Component {
  static propTypes = {
    getContainer: PropTypes.func,
    onContainerChange: PropTypes.func
  }

  static defaultProps = {
    onContainerChange: () => null
  }

  componentDidMount() {
    const { getContainer } = this.props;

    if (getContainer) {
      this.container = getContainer();
    }
    else {
      this.container = document.createElement('div');
    }

    document.body.appendChild(this.container);
    this.renderInner();

    this.props.onContainerChange(this.container);
  }

  componentWillUnmount() {
    const { container } = this;
    unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
    this.container = null;
  }

  componentDidUpdate() {
    this.renderInner();
  }

  renderInner() {
    unstable_renderSubtreeIntoContainer(
      this,
      React.cloneElement(
        this.props.children,
        {
          className: classNames(
            this.props.children.props.className,
            this.props.className
          )
        }
      ),
      this.container
    );
  }

  render() {
    return null;
  }
}

export default Portal;