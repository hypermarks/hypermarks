'use strict';

var createHypermark = require('./create-hypermark.js')
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
;

exports.postHypermark = function (req, res) {
  if (!req.user) {
    res.end('401');
  } else {
    var opts = {
        user_url: req.body.url
      , add_date: new Date()
      , user: req.user
    };
    createHypermark(opts, function(err){
      if (err) {
        console.log(err);
        res.end('500');
      } else {
        res.end('200');
      }
    });
  }
};


exports.getHypermarks = function (req, res) {
  if (!req.user) {
    res.end('401');
  } else {
    Bookmark.find({_user: req.user}, function (err, bookmarks) {
      if (err) {
        console.log(new Error(err));
        res.end('500');
      } else {
        res.json('200', bookmarks);
      }
    });
  }
};


exports.searchHypermarks = function (req, res) {
  Address.search({
    query: req.query.q
  }, function (err, results) {
    if (err) {
      console.log(err);
      res.end('500');
    } else {
      res.json('200', results);
    }
  });
};



