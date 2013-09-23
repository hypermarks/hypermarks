'use strict';
var $ = require('zepto-browserify').$
  , responseHandler = require('./responseHandlers.js');

//Put our styles in head
$('head').append('<link rel="stylesheet" href="http://localhost:1337/styles/bookmarklet.css">');

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    xhr.open(method, url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest() {
  var url = 'http://localhost:1337/_api/hypermarks';


  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    console.log('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    console.log('Response from CORS request to ' + url + ': ' + text);

    if (text === '200') {
      responseHandler.success();
    } else if (text === '401') {
      responseHandler.login();
    } else {
      responseHandler.error();
    }
  };

  xhr.onerror = function() {
    console.log('Woops, there was an error making the request.');
  };

  // xhr.send();
  xhr.send('url=' + window.location);
}

//Fire the request
makeCorsRequest();