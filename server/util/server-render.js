const serialize = require('serialize-javascript')
const ejs = require('ejs')
const asyncBootstrapper = require('react-async-bootstrapper')
const ReactSSR = require('react-dom/server')
const Helmet = require('react-helmet').default
const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeNmae) => {
    result[storeNmae] = stores[storeNmae].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  const createStoreMap = bundle.createStoreMap
  const createApp = bundle.default
  const routerContext = {}
  const stores = createStoreMap()
  const app = createApp(stores, routerContext, req.url)
  return new Promise((resolve, reject) => {
    asyncBootstrapper(app).then(() => {
      const content = ReactSSR.renderToString(app)
      if (routerContext.url) { // 如果react-router重定向之后，服务端也应该对应重定向
        res.status(302).setHeader('location', routerContext.url)
        res.end()
        return
      }
      const helmet = Helmet.rewind()
      const state = getStoreState(stores)
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString()
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}