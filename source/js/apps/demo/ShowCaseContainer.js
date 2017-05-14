import React, { Component } from 'react';
import classNames from 'classnames';

class ShowcaseContainer extends Component {
  render() {
    const { className } = this.props;
    
    return (
      <div className={classNames(
        'showcase',
        { [className]: !!className }
      )}>
        <h1>{this.props.title}</h1>
        <div className="items">
          {this.props.children}
        </div>
      </div>
    ); 
  }
}

export default ShowcaseContainer;
