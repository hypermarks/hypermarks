'use strict';


var env = process.env.NODE_ENV || 'development'
  , path = require('path')
  , rootPath = path.resolve(__dirname + '../..')

  , urlTools = require('url-tools')
;

console.log(process.env);
// console.log('config.js normalized BONSAI_URL', urlTools.normalize(process.env.BONSAI_URL, url_opts).replace(/:/, '%3A'))

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
  };
  return urlTools.normalize(eshost, url_opts).replace(/:/, '%3A');
}

console.log(env)

module.exports = function() {
  if (env === 'development') {
    return {
        root: rootPath
      , db: 'mongodb://localhost/hypermarks_dev'
      , url: 'http://localhost:1337'
      , es: 'localhost'
      , esport: '9200'
    };
  }
  if (env === 'heroku') {
    return {
        root: rootPath
      , db: process.env.MONGOLAB_URI
      , url: 'http://hypermarks.herokuapp.com'
      , es: elmongoUrlSanitize(process.env.BONSAI_URL)
      , esport: process.env.ES_PORT
    };
  }
  if (env === 'heroku-staging') {
    return {
        root: rootPath
      , db: process.env.MONGOLAB_URI
      , url: 'http://hypermarks-staging.herokuapp.com'
      , es: elmongoUrlSanitize(process.env.BONSAI_URL)
      , esport: process.env.ES_PORT
    };
  }
};
