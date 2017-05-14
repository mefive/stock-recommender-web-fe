import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import remove from 'lodash/remove';

import 'styles/components/animation.scss';

const INIT = 'init';
const MOUNTED = 'mounted';
const ANIMATED = 'animated';
const LEAVING = 'leaving';
const UMMOUNTED = 'ummounted';
const NO_KEY = 'no_key';

const propTypes = {
  enterClassName: PropTypes.string,
  leaveClassName: PropTypes.string,
  enterDuration: PropTypes.number,
  leaveDuration: PropTypes.number,
  activeClass: PropTypes.string,
};

const defaultProps = {
  enterDuration: 200,
  leaveDuration: 200,
  enterClassName: 'enter',
  leaveClassName: 'leave',
  activeClass: 'active',
};

class Animate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: INIT,
      children: [],
      statusMap: {}
    };

    const statusMap = {};

    if (this.props.children) {
      const children = [];

      React.Children.forEach(this.props.children, (child, index) => {
        const key = child.key || NO_KEY;
        statusMap[key] = { status: INIT, index };
        children.push({ index, child });
      });

      this.state = {
        ...this.state,
        statusMap,
        children
      };

      setTimeout(() => this.processMount());
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.children, this.props.children)) {
      const statusMap = { ...this.state.statusMap };

      const children = [];
      const newKeys = React.Children.map(
        nextProps.children, i => i ? (i.key || NO_KEY) : null
      );
      // console.log('newKeys', newKeys);

      // flag new item to INIT, 
      React.Children.forEach(nextProps.children, (child, index) => {
        if (child == null) {
          return true;
        }

        const key = child.key || NO_KEY;

        if (!(key in statusMap)) {
          statusMap[key] = {
            status: INIT,
            index
          };
        }

        children.push({ index, child });
      });

      let hasLeavingChild = false;

      // abandoned item to LEAVING
      Object.keys(statusMap).forEach(key => {
        if (!newKeys || newKeys.indexOf(key) === -1) {
          statusMap[key].status = LEAVING;

          hasLeavingChild = true;

          children.push({
            index: statusMap[key].index,
            child: this.state.children.find(i => (i.child.key || NO_KEY) === key).child
          });
        }
      });

      // console.log(sortBy(children, ['index']));
      this.setState({ children, statusMap });

      if (hasLeavingChild) {
        setTimeout(() => this.processLeave(), this.props.leaveDuration);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.children, this.props.children)) {
      setTimeout(() => this.processMount());
    }
  }

  processMount() {
    // console.log('processMount');

    if (!this._isMounted) {
      return;
    }

    const statusMap = { ...this.state.statusMap };

    Object.keys(statusMap).forEach(key => {
      if (statusMap[key].status === INIT) {
        statusMap[key].status = MOUNTED;
      }
    });

    this.setState({ statusMap });

    setTimeout(() => this.processEnter(), this.props.enterDuration);
  }

  processEnter() {
    // console.log('processEnter');

    if (!this._isMounted) {
      return;
    }

    const statusMap = { ...this.state.statusMap };

    Object.keys(statusMap).forEach(key => {
      if (statusMap[key].status === MOUNTED) {
        statusMap[key].status = ANIMATED;
      }
    });

    this.setState({ statusMap });
  }

  processLeave() {
    // console.log('processLeave');

    if (!this._isMounted) {
      return;
    }

    const statusMap = { ...this.state.statusMap };
    let children = [...this.state.children];

    Object.keys(statusMap).forEach(key => {
      if (statusMap[key].status === LEAVING) {
        delete statusMap[key];
        remove(children, i => (i.child.key || NO_KEY) === key);
      }
    });

    // console.log('children leave', children);

    this.setState({ statusMap, children });
  }

  getClassName(status) {
    const className = [];

    if (status === LEAVING) {
      className.push(this.props.leaveClassName);
    }

    if (status !== INIT && status !== LEAVING) {
      className.push(this.props.activeClass);
    }

    if (status === MOUNTED) {
      className.push(this.props.enterClassName);
    }

    // console.log('calculated className', status, className, classNames(...className));

    return classNames(...className);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { children } = this.state;

    if (children.length === 0 || children[0] == null) {
      children = null;
    }

    return (
      <span>
        {children && (
          children.length > 1
            ? children.map(({ child }) => {
              return React.cloneElement(
                child,
                {
                  className: classNames(
                    child.props.className,
                    this.getClassName(
                      this.state.statusMap[child.key || NO_KEY].status,
                    )
                  )
                }
              );
            })
            // for the case that single child with no key
            : React.cloneElement(
              children[0].child,
              {
                className: classNames(
                  children[0].child.props.className,
                  this.getClassName(
                    this.state.statusMap[children[0].child.key || NO_KEY].status,
                  )
                )
              }
            )
          )
        }
      </span>
    );
  }
}

Animate.propTypes = propTypes;
Animate.defaultProps = defaultProps;

export default Animate;
