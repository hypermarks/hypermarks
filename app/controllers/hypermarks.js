'use strict';

var createHypermark = require('./create-hypermark.js')
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
;

exports.postHypermark = function (req, res) {
  if (!req.user) {
    res.end('401');
  } else {
    var opts = {
      url: req.body.url
      , add_date: new Date()
      , user: req.user
    };
    createHypermark(opts, function(err){
      if (err) {
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
    Bookmark.find({user: req.user}, function (err, bookmarks) {
      if (err) {
        res.end('500');
      } else {
        res.json('200', bookmarks);
      }
    });
  }
};