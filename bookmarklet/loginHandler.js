'use strict';

module.exports = function () {
  var redirectUrl = window.location;
  window.location.href = 'http://localhost:1337/auth/externalLogin?redirectUrl=' + redirectUrl;
};