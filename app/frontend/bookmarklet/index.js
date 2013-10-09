'use strict';
var $ = require('zepto-browserify').$
  , responseHandler = require('./responseHandlers.js')
  , config = require('../../../config/config')()
;

console.log('bookmarklet', config)

//Put our styles in head 
//** This needs to be depicated.  Zepto does not load on major sites.
//$('head').append('<link rel="stylesheet" href="' + config.url + '/styles/bookmarklet.css">');

// Make the actual CORS request.
function loadRequest() {
  var img = new Image(); 
  img.onload=function(){
    responseHandler.success()
  }

  img.onError=function(event){
    responseHandler.error();
  }
  img.src = config.url+"/_api/post?url="+window.location.href;
}
//Fire the request
loadRequest();