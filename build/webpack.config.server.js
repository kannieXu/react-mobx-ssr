const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const htmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
module.exports = webpackMerge(baseConfig, {
  target: 'node', // 使用在node环境
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  externals: [nodeExternals({
    whitelist: [/.css$/],
  })],
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2' // 最新commonjs模块加载方案
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': '"http://localhost:3000"'
    })
  ]
})