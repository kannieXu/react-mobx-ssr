const axios = require('axios')
const httpProxMiddleware = require('http-proxy-middleware')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs')
const serverConfig = require('../../build/webpack.config.server')
const serverRender = require('./server-render')
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

let serverBundle
const NativeModule = require('module')
// module.wrap -> `(function(exports, require,module, __filename, __dirname) { `bundle的代码`})`
const vm = require('vm')
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  // vm -> 用于创建一个javascript执行环境，可执行字符串函数
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new MemoryFs()
const serverComplier = webpack(serverConfig)
serverComplier.outputFileSystem = mfs
serverComplier.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => {
    console.error(err)
  })
  stats.warnings.forEach(err => {
    console.warn(err)
  })
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
})

module.exports = function(app) {
  app.use('/public', httpProxMiddleware({
    target: 'http://127.0.0.1:8080'
  }))
  app.get('*', (req, res, next) => {
    console.log('in-----')
    if (!serverBundle) {
      return res.send('wait for compile, refresh later')
    }
    getTemplate().then(template => {
      serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}