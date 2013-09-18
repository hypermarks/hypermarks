'use strict';

var createHypermark = require('./create-hypermark.js')
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
;

exports.postHypermark = function (req, res) {
  if (!req.user) return res.end('401');
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
};


exports.getUserHypermarks = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.find({_user: req.user})
  .populate('_address')
  .exec(function (err, bookmarks) {
    if (err) return console.log(new Error(err));
    res.json('200', bookmarks);
  });
};


exports.getUserBlocks = function (req, res) {
  if (!req.user) return res.end('401');

  res.json('200', req.user.blocks)
  var blocks = req.user.blocks;
  var sorted = _.sortBy(blocks, date_accessed);
  res.json('200', sorted);
};


exports.getPrivateBlock = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.find({_user: req.user, block: req.body.block})
  .populate('_address')
  .exec(function (err, hypermarks) {
    if (err) return console.log(new Error(err));
    res.json('200', hypermarks);
  });
};


exports.getPublicBlock = function (req, res) {
  Bookmark.find({block: req.body.block})
  .populate('_address')
  .exec(function (err, hypermarks) {
    if (err) return console.log(new Error(err));
    res.json('200', hypermarks);
  });
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



