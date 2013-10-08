
/*!
 * Module dependencies.
 */

var path = require('path')
var rootPath = path.resolve(__dirname + '../..')

/**
 * Expose config
 */

module.exports = {
  development: {
    root: rootPath
    , db: 'mongodb://127.0.0.1/hypermarks_dev'
    , es: 'localhost:9200'
    , hostDomain: 'http://localhost:1337'
  },
  test: {
    root: rootPath
    , db: 'mongodb://127.0.0.1/hypermarks_test'
    , es: 'localhost:9200'
    , hostDomain: 'sfdevlabs.com:1337'
  },
  staging: {
    root: rootPath
    , db: process.env.MONGOHQ_URL
  },
  production: {
    root: rootPath
    , db: process.env.MONGOHQ_URL
  }
}
