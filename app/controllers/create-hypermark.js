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
 *    , add_date: new Date()
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


function addressUpsert (opts, cb) {
  Address.findOne({
    'sani_url': opts.sani_url
  }, function (err, address) {
    if (err) {
      return cb(err);
    }

    if (!address) { //We need to create a new address if it does not exist.
      address = new Address();
    }

    address.working_url = opts.page.working_url;
    address.favicon_url = opts.page.favicon_url || 'false';
    address.sani_url = opts.sani_url;
    address.content = opts.page.content;
    address.title = opts.page.title;
    address.save(function(err) {
      if (err) {
        return cb(err);
      } else {
        opts.address_id = address._id;
        console.log('saved address: ', address);
        return cb(null, opts); //Calls back with opts with address_id added
      }
    });
  });
}


function bookmarkCreate (opts, cb) {
  var bookmark = new Bookmark({
      _address: opts.address_id
    , _user: opts.user
    , sani_url: opts.sani_url
    , user_url: opts.user_url
    , add_date: opts.add_date //If undefined, model will set current date
  });
  bookmark.save(function (err) {
    if (err) {
      return cb(err);
    } else {
      console.log('saved bookmark: ', bookmark);
      return cb(null);
    }
  });
}
