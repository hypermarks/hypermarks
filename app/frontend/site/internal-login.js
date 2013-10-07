'use strict';


document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('#login')) document.querySelector('#login').addEventListener('click', function() {
    navigator.id.get(function(assertion) {
      if (!assertion) {
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://sfdevlabs.com:1337/_auth/browserid', true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.addEventListener('loadend', function() {
        window.location.reload();
      }, false);

      xhr.send(JSON.stringify({
        assertion: assertion
      }));
    }, {backgroundColor: '#75557A', siteName: 'Hypermarks'});

  }, false);

  if (document.querySelector('#logout')) document.querySelector('#logout').addEventListener('click', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://sfdevlabs:1337/_auth/logout', true);
    
    xhr.addEventListener('loadend', function() {
      window.location.reload();
    });

    xhr.send();
  }, false);
}, false);