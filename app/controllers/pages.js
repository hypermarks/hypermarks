'use strict';

var mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , stringUtils = require('../../utils/string-utils.js')
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
  var block = stringUtils.sanitize(req.params.block);
  console.log(block)
  Bookmark.getPublicBlock(block, function (err, hypermarks) {
    res.render('timeline', {
      user: req.user
      , favorite_blocks: req.user.getFavoriteBlocks()
      , results: hypermarks
    });
  });
};