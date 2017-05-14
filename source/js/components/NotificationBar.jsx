import React, { Component } from 'react';
import classNames from 'classnames';

import Animate from './Animate';
import sleep from 'utils/sleep';

import 'styles/components/notificationBar.scss';

export class Notification extends Component {
  componentDidMount() {
    this._isMounted = true;
    this.wait();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async wait() {
    await sleep(this.props.wait);
    if (this._isMounted) {
      this.props.onRemove();
    }
  }

  render() {
    const { type, message, className } = this.props;
    return (
      <div
        className={classNames(
          'notification',
          type || Notification.type.SUCC,
          { [className]: !!className }
        )}
      >
        {message}
      </div>
    )
  }
}

Notification.defaultProps = {
  wait: 3000,
  onRemove: () => {},
};

Notification.type = {
  ERROR: 'error',
  SUCC: 'succ',
};

const NotificationBar = (props) => (
  <div className="notification-bar">
    <Animate>
      {props.dataSource.map((i, index) => (
        <Notification
          key={i.id}
          message={i.message}
          type={i.type}
          onRemove={() => props.onRemove(index)}
        />
      ))}
    </Animate>
  </div>
);

NotificationBar.defaultProps = {
  dataSource: [],
  onRemove: () => {},
};

NotificationBar.Notification = Notification;

export default NotificationBar;
