import React from 'react'
import Routes from './router'
console.log(Routes)
export default class App extends React.Component {
  render() {
    return [
      <div key="app">This is app!!!come on!!!!</div>,
      <Routes key="route" />
    ]
  }
}