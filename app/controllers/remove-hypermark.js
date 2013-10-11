'use strict';

var parse = require('../../logic/parse.js');
var mongoose = require('mongoose');
var async = require('async');
var Bookmark = mongoose.model('Bookmark');

/**
 * Scrape page info and save to db's
 * 
 * This module takes info about a page from wherever, and calls parse.pageHarvest to get info about
 * the page. It then upserts the address and creates a bookmark.
 *
 * Example
 *  var opts = {
 *    url: req.body.url
 *    , user: req.user
 *  };
 *  createHypermark(opts, function(err){
 *    //Do something...
 *  });
 * 
 * 
 */

module.exports = function(opts, callback) {
  async.waterfall([
    function (cb) {
      Bookmark.remove(opts, function (err) {
        if (err) return cb(err);
        cb(null);
      });
    }
  ], function(err) {
    if (err) {
      return callback(err);
    } else {
      return callback(null);
    }
  });
};