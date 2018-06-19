import React from 'react'
import {
  observer,
  inject
} from 'mobx-react'
import Helmet from 'react-helmet'
@inject('appState') @observer
export default class detail extends React.Component {
  constructor() {
    super()
  }
  bootstrap() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true) // react-async-bootstrapper根据resolve的结果决定这个方法是否成功
      }, 2000)
    })
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>this is detail Componet</title>
          <meta name="description" content="this is a description from detail component" />
        </Helmet>
        <p>这是一个展示详情</p>
        <p>{this.props.appState.msg}</p>
      </div>
    )
  }
}