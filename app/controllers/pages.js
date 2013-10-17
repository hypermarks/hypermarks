'use strict';
var config = require('../../config/config')()
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
;

exports.uncategorized = function (req, res) {
  if (req.user) {
    Bookmark.getTimeline(req.user._id, function (err, hypermarks) {
      return res.render('list', {
          user: req.user
        , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
        , results: hypermarks
        , title: 'Uncategorized'
        , page: 'timeline'
        , hide_add: true
        , page_vars: {block: null, username: req.user.username}
      });
    });
  } else {
    return res.redirect('/_auth/login');
  }
};

exports.front = function (req, res) {
  Bookmark.recentlyUpdatedBlocks(function (err, results) {
    return res.send(results);
  });

  // res.render('multi-list', {
  //     user: req.user ? req.user : null
  //   , title: 'Top Lists'
  //   , results: results
  //   , page_vars: {block: null}
  // });
};

exports.publicBlock = function (req, res) {
  var block = stringUtils.sanitize(req.params.block)
    , username = req.user ? req.user.username : null;
  Bookmark.aggregatePublicBlock(block, function (err, hypermarks) {
    return res.render('list', {
        user: (req.user) ? req.user : null
      , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
      , results: hypermarks
      , title: block
      , visibility: 'public'
      , page: 'block'
      , page_vars: {block: block, username: username}
    });
  });
};

exports.privateBlock = function (req, res) {
    console.log(req.user.getFavoriteBlocks())
    var block = stringUtils.sanitize(req.params.block);
    Bookmark.getPrivateBlock(req.user._id, block, function (err, hypermarks) {
      return res.render('list', {
          user: req.user
        , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
        , results: hypermarks
        , title: block
        , visibility: 'private'
        , page: 'block'
        , page_vars: {block: block, username:req.user.username}
      });
    });

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
    return res.render('search_results', {
        user: (req.user) ? req.user : null
      , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
      , results: hypermarks
      , title: 'Search'
      , page: 'search'
      , page_vars: {block:null, username:req.user.username}
      , q: req.query.q
    });
  });
};