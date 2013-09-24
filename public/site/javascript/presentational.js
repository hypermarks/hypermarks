'use strict';

var $ = require('./vendor/jquery.js');

exports.flash = function ($this, flashClass, time) {
  if (!$this.hasClass(flashClass)) {
    $this.addClass(flashClass);
    setTimeout( function(){
      $this.removeClass(flashClass);
    }, time);
  }
};