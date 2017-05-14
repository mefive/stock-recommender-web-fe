import React from 'react';
import ReactDOM from 'react-dom';
import {
  applyRouterMiddleware,
  Router,
  Route,
  IndexRedirect,
  hashHistory
} from 'react-router';
import 'bootstrap/scss/bootstrap.scss';

import { Provider } from 'react-redux';

// pages
import Backtest from './Backtest';

import createStore from '../createStore';

import { combineReducers } from 'redux';
import { spawn } from 'redux-saga/effects';

const reducers = combineReducers({ backtest: require('../reducers/backtest').default });
const sagas = function* root() { yield [ spawn(require('../sagas/backtest').default) ]};

const store = createStore(
  reducers,
  sagas,
);

// console.log(store);

const Port = (props) => (
  <div className="container">
    {props.children}
  </div>
);

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={hashHistory}
    >
      <Route path="/" component={Port} >
        <IndexRedirect to="backtest" />
        <Route path="backtest" component={Backtest} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('main')
);
