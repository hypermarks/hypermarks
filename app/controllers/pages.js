'use strict';
var config = require('../../config/config')()
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , bm_loader = require('../frontend/bookmarklet/loader.js')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
  , async = require('async')
;



 
exports.timeline = function (req, res) {
  if (req.user) {
    async.parallel({
      aggregateUserLists: function(callback) {
        Bookmark.aggregateUserLists(req.user._id, function (err, results) {
          if (err) return callback(err);
          callback(null, results);
        });
      },
      getTimeline: function(callback) {
        Bookmark.getTimeline(req.user._id, function (err, results) {
          if (err) return callback(err);
          callback(null, results);
        });
      }
    },
    function (err, results) {
      if (err) return console.log(err);
      console.log('timeline results', results);
      return res.render('results', {
          user: req.user
        , bm_loader: bm_loader(config.url)
        , favorite_blocks: results.aggregateUserLists
        , results: results.getTimeline
        , title: 'Timeline'
        , page: 'timeline'
      });
    });
  } else {
    return res.render('login');
  }
};




exports.publicBlock = function (req, res) {
  if (!req.user) return res.end('401');
  var block = stringUtils.sanitize(req.params.block);
  Bookmark.aggregatePublicBlock(block, function (err, hypermarks) {
    return res.render('results', {
        user: (req.user) ? req.user : null
      , bm_loader: bm_loader(config.url)
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
    async.parallel({
      getPrivateBlock: function(callback) {
        Bookmark.getPrivateBlock(req.user._id, block, function (err, hypermarks) {
          callback(err, hypermarks);
        });
      },
      checkPublicBlock: function(callback) {
        Bookmark.checkPublicBlock(req.user._id, block, function (err, hypermarks) {
          console.log('checkPublicBlock', hypermarks);
          callback(err, hypermarks);
        });
      }
    },

    function (err, results) {
      console.log('checkPublicBlock ', results.checkPublicBlock)
      var public_check;
      if (results.checkPublicBlock.length) public_check = true;
      return res.render('results', {
          user: req.user
        , bm_loader: bm_loader(config.url)
        , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
        , results: results.getPrivateBlock
        , title: block
        , visibility: 'private'
        , page: 'block'
        , public_check: public_check ? 'public' : 'unpublic'
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
    console.log('pages.search results', results)
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
    });
  });
};