'use strict';

var mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash');

exports.timeline = function (req, res) {
  if (!req.user){
    res.render('home', {
        favorite_blocks: []
      , title: 'Home'
    });
    return;
  } else
  Bookmark.getTimeline(req.user._id, function (err, hypermarks) {
    res.render('results', {
      user: req.user
      , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
      , results: hypermarks
      , title: 'Timeline'
      , timeline: true
    });
  });
};

exports.publicBlock = function (req, res) {
  var block = stringUtils.sanitize(req.params.block);
  Bookmark.getPublicBlock(block, function (err, hypermarks) {
    res.render('results', {
      user: req.user
      , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
      , results: hypermarks
      , title: block
      , visibility: 'public'
    });
  });
};

exports.privateBlock = function (req, res) {
  var block = stringUtils.sanitize(req.params.block);
  Bookmark.getPrivateBlock(req.user._id, block, function (err, hypermarks) {
    console.log(JSON.stringify(results))
    res.render('results', {
        user: req.user
      , favorite_blocks: req.user.getFavoriteBlocks()
      , results: hypermarks
      , title: block
      , visibility: 'private'
    });
  });
};

exports.search = function (req, res) {
  Address.search({
    query: req.query.q
  }, function (err, results) {
    var hypermarks = _.map(results.hits, '_source')
    console.log(JSON.stringify(hypermarks))
    res.render('results', {
        user: req.user
      , favorite_blocks: req.user.getFavoriteBlocks()
      , results: hypermarks
      , title: 'Search'
    });
  });
};