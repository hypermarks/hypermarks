'use strict';


var env = process.env.NODE_ENV
  , path = require('path')
  , rootPath = path.resolve(__dirname + '../..')
  , port = process.env.PORT
  , urlTools = require('url-tools')
;

var url_opts = {
  lowercase: true,
  removeWWW: true,
  removeTrailingSlash: true,
  forceTrailingSlash: false,
  removeSearch: true,
  removeHash: true,
  removeHashbang: true,
  removeProtocol: true
}


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
  if (env === 'heroku-staging') {
    return {
        root: rootPath
      , db: process.env.MONGOLAB_URI
      , es: urlTools.normalize(process.env.BONSAI_URL, url_opts)
      , url: 'http://hypermarks-staging.herokuapp.com'
      , esport: process.env.ES_PORT
    };
  }
};
