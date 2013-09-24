'use strict';

var mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
;

exports.timeline = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.getTimeline(req.user._id, function (err, hypermarks) {
    res.render('timeline', {
      user: req.user
      , favorite_blocks: req.user.getFavoriteBlocks()
      , results: hypermarks
    });
  });
};

exports.publicBlock = function (req, res) {
  var block = req.params.block;
  console.log(block)
  Bookmark.getPublicBlock(block, function (err, hypermarks) {
    res.render('timeline', {
      user: req.user
      , favorite_blocks: req.user.getFavoriteBlocks()
      , results: hypermarks
    });
  });
};