'use strict';

var createHypermark = require('./create-hypermark.js')
  , removeHypermark = require('./remove-hypermark.js')
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , User = mongoose.model('User')
  , _ = require('lodash')
;


exports.postHypermark = function (req, res) {
  if (!req.user) return res.end('401');
  var opts = {
      user_url: req.body.url
    , user_id: req.user._id
    , chrome_extension_id: req.body.id
  };
  createHypermark(opts, function(err){
    if (err) return res.end('500');
    return res.end('200');
  });
};

exports.postHypermarkChrome = function (req, res) {
  if (!req.user) return res.end('401');
  var opts = {
      user_url: req.body.url
    , user_id: req.user._id
    , chrome_extension_id: req.body.id
  };
  createHypermark(opts, function(err){
    if (err) return res.end('500');
    return res.end('200');
  });
};

exports.removeHypermark = function (req, res) {
  if (!req.user) return res.end('401');
  console.log(req.body)

  var opts = {
      _id: req.body._id
    , _user: req.user._id
  };
  console.log(opts);
  removeHypermark(opts, function(err){
    if (err) return res.end('500');
    return res.redirect('/');
  });
};


exports.getTimeline = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.getTimeline(req.user._id, function (err, hypermarks) {
    if (err) return res.end('500');
    return res.json('200', hypermarks);
  });
};


exports.addToBlock = function (req, res) {
  if (!req.user) return res.end('401');
  var bookmark_id = req.body.bookmark_id;
  var block_id = req.body.block_id;

  Bookmark.findById(bookmark_id, function (err, bookmark) {
      if (err) return res.json('500', bookmark);
    bookmark.block=block_id;
    bookmark.save(function(err){
      if (err)
        return res.json('500', bookmark);
      else
        return res.json('200', bookmark);
    });

    // Bookmark.clone(bookmark, {
    //   block: block_id
    // }, function (err, bookmark) {
    //   if (err) return console.log(err);
    //   return res.json('200', bookmark);
    // });
  });

};


exports.getPrivateBlock = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.getPrivateBlock(req.user._id, req.param('block'), function (err, hypermarks) {
    if (err) return console.log(err);
    return res.json('200', hypermarks);
  });
};


exports.treePost = function (req, res) {
 // if (!req.user) return res.end('401');

  //console.log(req);

  //console.log(req.headers);


  console.log(req.body);


  res.send("Success");
};


exports.getPublicBlock = function (req, res) {
  Bookmark.aggregatePublicBlock(req.param('block'), function (err, hypermarks) {
    if (err) return console.log(err);
    return res.json('200', hypermarks);
  });
};


exports.searchHypermarks = function (req, res) {
  Address.search({
    query: req.query.q
  }, function (err, results) {
    if (err) return console.log(err);
    return res.json('200', results);
  });
};


exports.touchFavoriteBlock = function (req, res) {
  if (!req.user) return res.end('401');

  User.touchFavoriteBlock(req.user._id, req.body.block_id, function (err, user) {
    if (err) return console.log(err);

    var sorted_blocks = _.sortBy(user.favorite_blocks, 'date_accessed').reverse();
    return res.json('200', sorted_blocks);
  });
};


exports.getFavoriteBlocks = function (req, res) {
  if (!req.user) return res.end('401');

  return res.json('200', req.user.getFavoriteBlocks());
};
