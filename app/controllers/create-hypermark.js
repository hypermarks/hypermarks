'use strict';

var parse = require('../../logic/parse.js');
var mongoose = require('mongoose');
var async = require('async');
var Address = mongoose.model('Address');
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
  console.log('createHypermark');
  opts.sani_url = parse.urlSanitize(opts.user_url);
  parse.pageHarvest(opts.sani_url, function(err, page) { //Scrapes page

    //Add page onto opts object
    opts.page = page;

    if (err) {
      callback(err);
    } else {
      async.waterfall([
        function (cb) {
          Address.upsert(opts, function (err, opts) {
            if (err) return cb(err);
            cb(null, opts);
          });
        }
        , function (opts, cb) {
          console.log('createHypermark opts', opts)
          Bookmark.create(opts, function (err) {
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
    }
  });
};