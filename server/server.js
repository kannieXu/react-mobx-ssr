const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const serverRender = require('./util/server-render')
const isDev = process.env.NODE_ENV === 'development'
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use('/api', require('./util/api'))
if (!isDev) {
  const serverEntry = require('../dist/server-entry')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf-8');
  app.get('*', (req, res, next) => {
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).send(error)
})
app.listen(3000, () => {
  console.log('server is listening on 3000')
})