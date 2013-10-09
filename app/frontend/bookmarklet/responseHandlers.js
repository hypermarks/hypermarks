'use strict';

var $ = require('zepto-browserify').$
  , success_flash = require('../../views/bookmarklet/success-flash.jade')
  , login_modal = require('../../views/bookmarklet/login-modal.jade')
  , error_modal = require('../../views/bookmarklet/error-modal.jade')
  , config = require('../../../config/config')()
;

var $body = $(document.body);

function modalWindow (el) {
  var $el = $(el);

  $el.find('.js-close').on('click', function () {
    $el.remove();
  });

  return $el;
}


exports.login = function () {
  var $el = modalWindow(login_modal({
    url: config.url + '/_auth/external-login'
  }));

  $body.append($el);
};


exports.success = function () {
  var $el = $(success_flash());

  $body.append($el);
  setTimeout(function(){ $el.addClass('_fade'); }, 100);
  setTimeout(function(){ $el.remove(); }, 2000);
};


exports.error = function () {
  var $el = modalWindow(error_modal());

  $body.append($el);
};