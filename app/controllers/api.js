'use strict';

var createHypermark = require('./create-hypermark.js')
  , removeHypermark = require('./remove-hypermark.js')
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , User = mongoose.model('User')
  , Reservation = mongoose.model('Reservation')
  , _ = require('lodash')
  ,fs = require('fs');

exports.imagePost = function (req, res) {
  if (!req.user) return res.end('401');
  createHypermark({
      user_url: req.param('url')
    , user_id: req.user._id
  }
  , function (err) {
    if (err) return res.end('500');
    var img = fs.readFileSync('./public/images/pixel.gif');
    res.writeHead(200, {'Content-Type': 'image/gif' });
    return res.end(img, 'binary');
  });
};

exports.reserveUsername = function (req, res) {
  Reservation.reserve(req.body.username, req.body.email, function(err){
    if (err) {
      if (err === 'username') {
        return res.redirect('http://hypermarks.org/username-taken.html');
      }
      if (err === 'email') {
        return res.redirect('http://hypermarks.org/email-taken.html');
      }
      return res.redirect('http://hypermarks.org/server-error.html');
    } else {
      return res.redirect('http://hypermarks.org/success.html');
    }
  });
};

exports.postHypermark = function (req, res) {
  if (!req.user) return res.end('401');
  var block = req.body.block;
  var opts = {
      user_url: req.body.url
    , user_id: req.user._id
    , block: block
  };
  createHypermark(opts, function(err){
    if (err) return console.log(err);
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
  var opts = {
      _id: req.body._id
    , _user: req.user._id
  };
  Bookmark.remove(opts, function(err){
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


exports.cloneToBlock = function (req, res) {
  if (!req.user) return res.end('401');
  var bookmark_id = req.body.bookmark_id;
  var block_id = req.body.block_id;

  Bookmark.clone(bookmark_id, {
    block: block_id
  }, function (err, bookmark) {
    if (err) {
      console.log(err);
      return res.end('500');
    }
    return res.json('200', bookmark);
  });

};

exports.moveToBlock = function (req, res) {
  if (!req.user) return res.end('401');
  var bookmark_id = req.body.bookmark_id
    , block_id = req.body.block_id;

  Bookmark.move(bookmark_id, {
    block: block_id
  }, function (err, bookmark) {
    if (err) return console.log(err);
    return res.json('200', bookmark);
  });


};


exports.getPrivateBlock = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.getPrivateBlock(req.user._id, req.param('block'), function (err, hypermarks) {
    if (err) return console.log(err);
    return res.json('200', hypermarks);
  });
};


exports.getPublicBlock = function (req, res) {
  var block_id = req.param('block');
  Bookmark.aggregatePublicBlock(block_id, function (err, hypermarks) {
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

exports.deleteFavoriteBlock = function (req, res) {
  if (!req.user) return res.end('401');
  User.deleteFavoriteBlock(req.user._id, req.body.block_id, function (err, user) {
    if (err) return console.log(err);

    var sorted_blocks = _.sortBy(user.favorite_blocks, 'date_accessed').reverse();
    return res.json('200', sorted_blocks);
  });
};



exports.getFavoriteBlocks = function (req, res) {
  if (!req.user) return res.end('401');

  return res.json('200', req.user.getFavoriteBlocks());
};
