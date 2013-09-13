'use strict';
var $ = require('zepto-browserify').$
  , view = require('./views/successFlash.jade')
;


$(document.body).append(view());
