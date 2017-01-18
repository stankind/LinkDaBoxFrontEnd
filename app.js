import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'
import { getDefaultLdbState, ldbReducer } from './stateMgmt/LdbReducer'
import { LdbCanvasContainer } from './components/LdbCanvas'


const initialState = getDefaultLdbState();
const store        = createStore( ldbReducer, initialState);

ReactDOM.render(

  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/LinkDaBox' component={LdbCanvasContainer} />
    </Router>
  </Provider>,
  document.getElementById('app-div')
);