'use strict';

var $ = require('./vendor/jquery.js')
  , airwaves = require('airwaves')
  , modesChannel = new airwaves.Channel()
;


exports.results = function ($el) {

  $el.find('.js-add-to-list').on('click', function() {
    var $hypermark = $(this).parents('.hypermark')
      , bookmark_id = $hypermark.attr('data-_id')
    ;
    $(this).addClass('-active');
    $hypermark.addClass('top');
    modesChannel.broadcast('enter_add-to-list', bookmark_id);
  });

  modesChannel.subscribe('exit_add-to-list', function() {
    $el.find('.js-add-to-list').removeClass('-active');
    $el.find('.hypermark').removeClass('top');
  });

};


exports.sidebar = function ($el) {
  
  modesChannel.subscribe('enter_add-to-list', function(bookmark_id){
    $el.addClass('top');
    $el.find('.js-fave-lists').addClass('-hoverable');
    $el.on('click.add-to-list', '.js-list', function() {
      var block_id = $(this).text();
      $.post('/_api/blocks', { bookmark_id: bookmark_id, block_id: block_id });
      modesChannel.broadcast('exit_add-to-list');
    });
  });
  
  modesChannel.subscribe('exit_add-to-list', function() {
    $el.off('.add-to-list');
    $el.find('.js-fave-lists').removeClass('-hoverable');
  });

};


exports.global = function ($el) {
  
  $('.js-toggle').on('click', function() {
    $(this).toggleClass('toggle-on');
  });

  modesChannel.subscribe('enter_add-to-list', function() {
    $('.modal-overlay').addClass('-shown');
    $el.on('click.add-to-list', '.modal-overlay', function() {
      modesChannel.broadcast('exit_add-to-list');
    });
  });

  modesChannel.subscribe('exit_add-to-list', function() {
    $('.modal-overlay').removeClass('-shown');
    $el.off('.add-to-list');
  });

};