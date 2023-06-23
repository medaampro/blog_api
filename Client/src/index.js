import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./style.css"

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './Reducers/index';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';

let store = createStore( rootReducer, composeWithDevTools(applyMiddleware(thunk)) )

ReactDOM.render(
  <React.StrictMode>

    <Provider store={ store } >
      <App />
    </Provider>

  </React.StrictMode>,
  document.getElementById('root')
);

