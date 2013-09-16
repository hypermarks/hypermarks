'use strict';

var parse = require('../../logic/parse.js');
var mongoose = require('mongoose');
var async = require('async');
var Address = mongoose.model('Address');

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
 *    , add_date: null //Model will set current date
 *    , user: req.user
 *  };
 *  createHypermark(opts, function(err){
 *    //Do something...
 *  });
 * 
 * 
 */

module.exports = function(opts, callback) {
  console.log('createHypermark', opts)
  var saniUrl = parse.urlSanitize(opts.url);
  parse.pageHarvest(saniUrl, function(err, page) { //Scrapes page
    if (err) {
      callback(err);
    } else {
      async.waterfall([
        function (cb) {
          addressUpsert(page, opts.user, cb);
        }
        , function (_id, cb) {
          bookmarkCreate(opts, _id, cb);
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


function addressUpsert(page, user, cb) {
  // console.log(page);
  console.log('addressUpsert', page.saniUrl);
  Address.findOneAndUpdate({
    saniUrl: page.saniUrl //Sanitizes URL to avoid multiples of the same page
  }, {
    $set: { //Creates or overwrite items with new scrape data
      url: page.url
      , sani_url: page.sani_url
      , favicon: page.favi_url || 'false' //Guards against trying to write a boolean to the db
      , content: page.content
      , title: page.title
    },
    $addToSet: { //Adds reference to the user for filtering later
      users: user._id
    }
  }, {
    upsert: true //Creates new document if one does not exist :-)
    , select: '_id' //Select only fields we need
  }, function(err, _id) {
    console.log('_id', _id);
    if (err) { 
      return cb(err);
    } else {
      return cb(null, _id);
    }
  });
}


function bookmarkCreate(opts, _id, cb) {
  console.log('bookmarkCreate', opts);
  opts.user.bookmarks.push({
    url: opts.url
    , add_date: opts.add_date
    , address: opts.address_id
  });
  opts.user.save(function(err) {
    if (err) {
      return cb(err);
    } else {
      return cb(null);
    }
  });
}
