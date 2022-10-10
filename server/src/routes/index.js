// const fs = require('fs')
// const crypto = require('crypto')
// const path = require('path')
const user = require('./user')
const assets = require('./assets')
const prespectives = require('./prespectives')
const subgraph = require('./subgraph')
const api = require('./api')
const course = require('./course')
const video = require('./video')
const spider = require('./spider')
const crontab = require('./crontab')
// const productList = require('./assets')

module.exports = (app) => {
  // CORS
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", 'express 4.17.1')
    next();
  })

  app.use('/login', user),
  app.use('/assets',  assets)
  app.use('/prespectives',  prespectives)
  app.use('/subgraph',  subgraph)
  app.use('/api',  api)
  app.use('/course',  course)
  app.use('/video',  video)
  app.use('/spider',  spider)
  app.use('/crontab',  crontab)
//   app.use('/*', (req, res) => {
//     res.send('404 NOT FOUND')
//   })
}