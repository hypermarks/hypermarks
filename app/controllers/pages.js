'use strict';

var mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
;

//UTILITY
function unwrapAddress(results) {
  return _.map(results, function(result){
    var _address = result._address;
    console.log(_address)
    return _.assign(result, _address);
  });
}

exports.timeline = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.getTimeline(req.user._id, function (err, hypermarks) {
    res.render('results', {
        user: req.user
      , favorite_blocks: req.user.getFavoriteBlocks()
      , results: hypermarks
      , title: 'Timeline'
      , page: 'timeline'
    });
  });
};

exports.publicBlock = function (req, res) {
  var block = stringUtils.sanitize(req.params.block);
  Bookmark.getPublicBlock(block, function (err, hypermarks) {
    // var hypermarks = unwrapAddress(results);
    res.render('results', {
        user: req.user
      , favorite_blocks: req.user.getFavoriteBlocks()
      , results: hypermarks
      , title: block
      , visibility: 'public'
      , page: 'block'
    });
  });
};

exports.privateBlock = function (req, res) {
  var block = stringUtils.sanitize(req.params.block);
  Bookmark.getPrivateBlock(req.user._id, block, function (err, hypermarks) {
    // var hypermarks = unwrapAddress(results);
    res.render('results', {
        user: req.user
      , favorite_blocks: req.user.getFavoriteBlocks()
      , results: hypermarks
      , title: block
      , visibility: 'private'
      , page: 'block'
    });
  });
};

exports.search = function (req, res) {
  Address.search({
    query: req.query.q
  }, function (err, results) {
    var hypermarks = _.map(results.hits, function(result) {
      result._address = result._source;
      delete result._source;
      return result
    });
    res.render('results', {
        user: req.user
      , favorite_blocks: req.user.getFavoriteBlocks()
      , results: hypermarks
      , title: 'Search'
      , page: 'search'
    });
  });
};