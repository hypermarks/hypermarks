'use strict';


var env = process.env.NODE_ENV || 'development'
  , path = require('path')
  , rootPath = path.resolve(__dirname + '../..')
  , port = process.env.PORT || '1337'
  , urlTools = require('url-tools')
;

function elmongoUrlSanitize(eshost) {
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
  return urlTools.normalize(eshost, url_opts).replace(/:/, '%3A')
}


module.exports = function() {
  if (env === 'development') {
    return {
        root: rootPath
      , db: 'mongodb://localhost/hypermarks_dev'
      , es: 'localhost'
      , url: 'http://localhost:' + port
      , esport: 9200
      , port: port
    };
  }
  if (env === 'heroku') {
    return {
        root: rootPath
      , db: process.env.MONGOLAB_URI
      , es: elmongoUrlSanitize(process.env.BONSAI_URL)
      , url: 'http://hypermarks.herokuapp.com'
      , esport: 80
      , port: port
    };
  }
  if (env === 'heroku-staging') {
    return {
        root: rootPath
      , db: process.env.MONGOLAB_URI
      , es: elmongoUrlSanitize(process.env.BONSAI_URL)
      , url: 'http://hypermarks-staging.herokuapp.com'
      , esport: 80
      , port: port
    };
  }
};
