'use strict';

var $ = require('zepto-browserify').$
  , view = $(require('./views/success-flash.jade')())
;

module.exports = function () {
  console.log('successHandler');
  var body = $(document.body);
  body.append(view);

  setTimeout( function(){ view.remove() }, 2000);
};