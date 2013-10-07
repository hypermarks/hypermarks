
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
    , db: 'mongodb://localhost/hypermarks_dev'
    , es: 'localhost:9200'
    , hostDomain: 'http://localhost:1337'
  },
  test: {
    root: rootPath
    , db: 'mongodb://localhost/hypermarks_test'
    , es: 'localhost:9200'
    , hostDomain: 'http://sfdevlabs.com:1337'
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
