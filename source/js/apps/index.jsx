import React from 'react';
import ReactDOM from 'react-dom';
import {
  applyRouterMiddleware,
  Router,
  Route,
  IndexRedirect,
  hashHistory
} from 'react-router';

const Welcome = () => <h1>Welcome</h1>;

ReactDOM.render(
  <Router
    history={hashHistory}
  >
    <Route path="/" component={Welcome} />
  </Router>,
  document.getElementById('main')
);
