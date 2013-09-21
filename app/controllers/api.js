'use strict';

var createHypermark = require('./create-hypermark.js')
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , User = mongoose.model('User')
;


exports.postHypermark = function (req, res) {
  if (!req.user) return res.end('401');
  var opts = {
      user_url: req.body.url
    , user_id: req.user._id
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


exports.getTimeline = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.getTimeline(req.user._id, function (err, hypermarks) {
    if (err) return res.end('500');
    res.json('200', hypermarks);
  });
};


exports.addToBlock = function (req, res) {
  if (!req.user) return res.end('401');

  var source_id = req.body.source_id;
  var dest_block = req.body.dest_block;

  Bookmark.findById(source_id, function (err, bookmark) {
    if (err) return next(err);

    Bookmark.clone(bookmark, {
      block: dest_block
    }, function (err, bookmark) {
      if (err) return next(err);
      res.json('200', bookmark);
    });
  });

};


exports.getPrivateBlock = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.getPrivateBlock(req.user._id, req.param('block'), function (err, hypermarks) {
    if (err) return next(err);
    res.json('200');
  });
};


exports.getPublicBlock = function (req, res) {
  Bookmark.getPublicBlock(req.param('block'), function (err, hypermarks) {
    if (err) return next(err);
    res.json('200', hypermarks);
  });
};


exports.searchHypermarks = function (req, res) {
  Address.search({
    query: req.query.q
  }, function (err, results) {
    if (err) return next(err);
    res.json('200', results);
  });
};


exports.touchFavoriteBlock = function (req, res) {
  console.log(req.body.block);
  User.touchFavoriteBlock(req.user._id, req.body.block, function (err, block) {
    if (err) return next(err);
    res.json('200', block)
  });
};

exports.getFavoriteBlocks = function (req, res) {

};