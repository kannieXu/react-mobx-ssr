const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
let config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new htmlWebpackPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs',
      inject: true
    })
  ]
})
if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.devServer = {
    host: '0.0.0.0', // 使用任何方式访问
    port: '8080',
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    inline: true,
    lazy: false,
    overlay: { // 编译过程出现错误，在浏览器显示一层mask显示错误
      errors: true
    },
    historyApiFallback: {
      index: '/public/index.html'
    },
    publicPath: '/public/',
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        "changeOrigin": true,
        "secure": false
      }
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin())
}

module.exports = config