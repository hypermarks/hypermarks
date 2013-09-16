'use strict';

var $ = require('zepto-browserify').$
  , success_flash = require('./views/success-flash.jade')
  , login_modal = require('./views/login-modal.jade')
  , error_modal = require('./views/error-modal.jade')
;

exports.success = function () {
  // console.log('successHandler');
  var body = $(document.body)
    , flash = $(success_flash())
  ;

  body.append(flash);
  
  setTimeout(function(){ flash.addClass('_fade'); }, 100);
  setTimeout(function(){ flash.remove(); }, 2000);
};


exports.login = function () {
  var redirectUrl = window.location
    , body = $(document.body);
    
  body.append(login_modal({
    url: 'http://localhost:1337/auth/externalLogin?redirectUrl=' + redirectUrl
  }));
};


exports.error = function () {
  var body = $(document.body);
    
  body.append(error_modal());
};