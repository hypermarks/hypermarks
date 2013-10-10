'use strict';
var responseHandler = require('./responseHandlers.js')
  , config = require('../../../config/config')()
;

function loadRequest() {
  console.log('loadRequest')
  var img = new Image();
  img.onload = function(){
    responseHandler.success()
  }

  img.onerror = function(){
    responseHandler.login();
  }
  img.src = config.url + '/_api/post?url=' + window.location.href;
}

loadRequest(); //Fire the request



