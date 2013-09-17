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
 * the page. It then checks the address index and inserts a new record if the address does not yet
 * exist, or updates an existing record. It then inserts a record in the user's 'bookmarks' sub index,
 * containing the url, the add_date and the _id of the address record.
 *
 * Example
 *  var opts = {
 *    url: req.body.url
 *    , add_date: null //If null, model will set current date
 *    , user: req.user
 *  };
 *  createHypermark(opts, function(err){
 *    //Do something...
 *  });
 * 
 * 
 */

module.exports = function(opts, callback) {
  opts.sani_url = parse.urlSanitize(opts.url);
  parse.pageHarvest(opts.sani_url, function(err, page) { //Scrapes page

    //Adds page onto opts object
    opts.page = page;

    if (err) {
      callback(err);
    } else {
      async.waterfall([
        function (cb) {
          addressUpsert(opts, cb);
        }
        , function (opts, cb) {
          bookmarkCreate(opts, cb);
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


function addressUpsert(opts, cb) {
  console.log(opts)
  Address.findOneAndUpdate({
    saniUrl: opts.sani_url
  }, {
    $set: { //Creates or overwrites items with new scrape data
      sani_url: opts.sani_url
      , url: opts.page.url
      , favicon: opts.page.favi_url || 'false' //Guards against trying to write a boolean to the db
      , content: opts.page.content
      , title: opts.page.title
    },
    $addToSet: { //Adds reference to the user for filtering later
      users: opts.user._id
    }
  }, {
    upsert: true //Creates new document if one does not exist :-)
    , select: '_id' //Select only fields we need
  }, function(err, _id) {
    if (err) {
      return cb(err);
    } else {
      opts.address_id = _id;
      return cb(null, opts); //Calls back with opts with _id added
    }
  });
}


function bookmarkCreate (opts, cb) {
  var bookmark = new Bookmark({
    address: opts.address_id
    , user: opts.user
    , sani_url: opts.sani_url
    , working_url: opts.page.url
    , add_date: opts.add_date //If undefined, model will set current date
  });
  bookmark.save(function (err) {
    if (err) {
      return cb(err);
    } else {
      return cb(null);
    }
  });
}
