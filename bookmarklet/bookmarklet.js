'use strict';

var successHandler = require('./successHandler.js');
var loginHandler = require('./loginHandler.js');
var errorHandler = require('./errorHandler.js');

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
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
  var url = 'http://localhost:1337/api/bookmarks';


  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    alert('Response from CORS request to ' + url + ': ' + text);
    if (text === '200') {
      console.log('200')
      successHandler();
    } else if (text === '401') {
      loginHandler();
    } else if (text === '500') {
      errorHandler();
    }
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  // xhr.send();
  xhr.send('url=' + window.location);
}

//Fire the request
makeCorsRequest();