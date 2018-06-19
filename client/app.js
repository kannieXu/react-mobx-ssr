import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter
} from 'react-router-dom'
import { Provider } from 'mobx-react'
import { AppContainer} from 'react-hot-loader'
import App from './App.jsx'
import {AppState} from './store/store'
const initialState = window.__INITIAL_STATE__ || {}
// ReactDOM.hydrate(<App />, document.getElementById('root'))
const root = document.getElementById('root')
const render = (Component, stores) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider {...stores}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root
  )
}
render(App, {
  appState: new AppState(initialState.appState)
})
if (module.hot) {
  module.hot.accept(['./App.jsx', './store/store'], () => {
    const NextApp = require('./App.jsx').default
    const NextAppState = require('./store/store')
    render(NextApp, {
      appState: new NextAppState(initialState.appState)
    })
  })
}