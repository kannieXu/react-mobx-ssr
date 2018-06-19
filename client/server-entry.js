import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react' 
import App from './App.jsx'
import { createStoreMap } from './store/store'
// 让mobx在服务端渲染的时候不会重复数据变换，例如compute不会重复执行
useStaticRendering(true)

export default (stores, routerContext, url) => {
  console.log('server' + Date.now())
  return (
    <Provider {...stores}>
      <StaticRouter context={routerContext}  location={url}>
        <App />
      </StaticRouter>
    </Provider>
  )
}
export { createStoreMap }