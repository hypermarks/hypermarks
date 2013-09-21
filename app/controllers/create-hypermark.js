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


// function addressUpsert (opts, cb) {
//   Address.findOne({
//     'sani_url': opts.sani_url
//   }, function (err, address) {
//     if (err) {
//       return cb(err);
//     }

//     if (!address) { //We need to create a new address if it does not exist.
//       address = new Address();
//     }

//     address.working_url = opts.page.working_url;
//     address.favicon_url = opts.page.favicon_url || 'false';
//     address.sani_url = opts.sani_url;
//     address.content = opts.page.content;
//     address.title = opts.page.title;
//     address.save(function(err) {
//       if (err) {
//         return cb(err);
//       } else {
//         opts.address_id = address._id;
//         console.log('saved address: ', address);
//         return cb(null, opts); //Calls back with opts with address_id added
//       }
//     });
//   });
// }


// function bookmarkCreate (opts, cb) {
//   var bookmark = new Bookmark({
//       _address: opts.address_id
//     , _user: opts.user
//     , sani_url: opts.sani_url
//     , user_url: opts.user_url
//     , add_date: opts.add_date //If undefined, model will set current date
//   });
//   bookmark.save(function (err) {
//     if (err) {
//       return cb(err);
//     } else {
//       console.log('saved bookmark: ', bookmark);
//       return cb(null);
//     }
//   });
// }
