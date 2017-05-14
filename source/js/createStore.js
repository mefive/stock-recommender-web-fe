import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import thunk from 'redux-thunk';

const sagaMiddleware = createSagaMiddleware();

export default function (reducer, saga, initialState = {}) {
  const store = createStore(
    reducer,
    webapckEnv === 'development'
      ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      : initialState,
    applyMiddleware(thunk, sagaMiddleware)
  );

  sagaMiddleware.run(saga);

  return store;
}
