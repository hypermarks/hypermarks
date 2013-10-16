'use strict';
var config = require('../../config/config')()
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , bm_loader = require('../frontend/bookmarklet/loader.js')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
;

exports.uncategorized = function (req, res) {
  if (req.user) {
    Bookmark.getTimeline(req.user._id, function (err, hypermarks) {
      return res.render('list', {
          user: req.user
        , bm_loader: bm_loader(config.url)
        , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
        , results: hypermarks
        , title: 'Uncategorized'
        , page: 'timeline'
        , hide_add: true
        , page_vars: {block: null, username: req.user.username}
      });
    });
  } else {
    return res.redirect('/');
  }
};

exports.front = function (req, res) {
  return res.render('results' ,{
      bm_loader: bm_loader(config.url)
    , user: req.user ? req.user : null
    , title: 'Top Lists'
    , page_vars: {block: null}
  });
};

exports.publicBlock = function (req, res) {
  if (!req.user) return res.end('401');
  var block = stringUtils.sanitize(req.params.block);
  Bookmark.aggregatePublicBlock(block, function (err, hypermarks) {
    return res.render('list', {
        user: (req.user) ? req.user : null
      , bm_loader: bm_loader(config.url)
      , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
      , results: hypermarks
      , title: block
      , visibility: 'public'
      , page: 'block'
      , page_vars: {block: block, username: req.user.username}
    });
  });
};

exports.privateBlock = function (req, res) {
  var block = stringUtils.sanitize(req.params.block);
  if (req.user) {
    Bookmark.getPrivateBlock(req.user._id, block, function (err, hypermarks) {
      return res.render('list', {
          user: req.user
        , bm_loader: bm_loader(config.url)
        , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
        , results: hypermarks
        , title: block
        , visibility: 'private'
        , page: 'block'
        , page_vars: {block: block, username:req.user.username}
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
    if (err) console.log(err);
    var hypermarks = _.map(results.hits, function(result) {
      result._address = result._source;
      delete result._source;
      return result;
    });
    return res.render('results', {
        user: (req.user) ? req.user : null
      , bm_loader: bm_loader(config.url)
      , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
      , results: hypermarks
      , title: 'Search'
      , page: 'search'
      , page_vars: {block:null, username:req.user.username}

    });
  });
};