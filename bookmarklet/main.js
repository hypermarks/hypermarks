'use strict';

// //Testing external login
// var redirectUrl = window.location;
// window.location.href = 'http://localhost:1337/auth/externalLogin?redirectUrl=' + redirectUrl;

var view = require('./test.jade');

console.log(view());

require('./test.js')();

// window.getElementById('page-header').innerHTML = view({
//     localVar: 'value'
// });

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
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  // xhr.send();
  xhr.send('url=' + window.location);
}

makeCorsRequest();