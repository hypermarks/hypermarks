'use strict';

var mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , bm_loader = require('../frontend/bookmarklet/loader.js')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
;

exports.timeline = function (req, res) {
  if (req.user) {
    Bookmark.getTimeline(req.user._id, function (err, hypermarks) {
      return res.render('results', {
          user: req.user
        , bm_loader: bm_loader
        , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
        , results: hypermarks
        , title: 'Timeline'
        , page: 'timeline'
      });
    });
  } else {
    return res.render('login');
  }
};

exports.publicBlock = function (req, res) {
  var block = stringUtils.sanitize(req.params.block);
  Bookmark.aggregatePublicBlock(block, function (err, hypermarks) {
    return res.render('results', {
        user: (req.user) ? req.user : null
      , bm_loader: bm_loader
      , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
      , results: hypermarks
      , title: block
      , visibility: 'public'
      , page: 'block'
    });
  });
};

exports.privateBlock = function (req, res) {
  var block = stringUtils.sanitize(req.params.block);
  
  if (req.user) {
    Bookmark.getPrivateBlock(req.user._id, block, function (err, hypermarks) {
      return res.render('results', {
          user: req.user
        , bm_loader: bm_loader
        , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
        , results: hypermarks
        , title: block
        , visibility: 'private'
        , page: 'block'
      });
    });
  } else {
    return res.redirect('/' + req.params.block);
  }
};

exports.search = function (req, res) {
  Address.search({
    query: req.query.q
  }, function (err, results) {
    var hypermarks = _.map(results.hits, function(result) {
      result._address = result._source;
      delete result._source;
      return result;
    });
    return res.render('results', {
        user: (req.user) ? req.user : null
      , bm_loader: bm_loader
      , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
      , results: hypermarks
      , title: 'Search'
      , page: 'search'
    });
  });
};