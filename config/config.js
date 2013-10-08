'use strict';

var env = process.env.NODE_ENV || 'development'
  , path = require('path')
  , rootPath = path.resolve(__dirname + '../..')
;

module.exports = function() {
  if (env === 'development') {
    return {
        root: rootPath
      , db: 'mongodb://localhost/hypermarks_dev'
      , es: 'localhost:9200'
      , url: 'http://localhost:1337'
    };
  }
  if (env === 'heroku') {
    return {
        root: rootPath
      , db: process.env.MONGOLAB_URI
      , es: process.env.BONSAI_URL
      , url: 'http://hypermarks.herokuapp.com/'
    };
  }
};