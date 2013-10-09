'use strict';

console.log('configconfig', process.env);

var env = process.env.NODE_ENV || development
  , path = require('path')
  , rootPath = path.resolve(__dirname + '../..')
  , port = process.env.PORT || 1337;

module.exports = function() {
  if (env === 'development') {
    return {
        root: rootPath
      , db: 'mongodb://localhost/hypermarks_dev'
      , es: 'localhost'
      , url: 'http://localhost:' + port
      , esport: process.env.ES_PORT
    };
  }
  if (env === 'heroku') {
    return {
        root: rootPath
      , db: process.env.MONGOLAB_URI
      , es: process.env.BONSAI_URL
      , url: 'http://hypermarks.herokuapp.com'
      , esport: process.env.ES_PORT
    };
  }
};
