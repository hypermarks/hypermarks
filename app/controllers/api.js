'use strict';

var createHypermark = require('./create-hypermark.js')
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
  };
  createHypermark(opts, function(err){
    if (err) {
      console.log(err);
      res.end('500');
    } else {
      res.end('200');
    }
  });
};

exports.getTimeline = function (req, res) {
  if (!req.user) return res.end('401');

  Bookmark.getTimeline(req.user._id, function (err, hypermarks) {
    if (err) return res.end('500');
    res.json('200', hypermarks);
  });
};

exports.cloneHypermark = function (req, res) {
  if (!req.user) return res.end('401');

  var source_id = req.body.source_id;
  var dest_block = req.body.dest_block;

  Bookmark.findById(source_id, function (err, bookmark) {
    if (err) next(err);

    console.log(bookmark)
    Bookmark.clone(bookmark, {
      block: dest_block
    }, function (err) {
      if (err) return console.log(err);
      res.end('200');
    });
  });

};

// getFavoriteBlocks = function (req, res) {
//   if (!req.user) return res.end('401');

//   var blocks = req.user.blocks;
//   var sorted = _.sortBy(blocks, 'date_accessed');
//   res.json('200', sorted);
// };


exports.addToBlock = function (req, res) {
  if (!req.user) return res.end('401');

  req.user.touchFavoriteBlock(req.body.block, function (err) {
    if (err) return res.end('500');
    res.end('200');
  });
};

// getPrivateBlock = function (req, res) {
//   if (!req.user) return res.end('401');

//   Bookmark.find({_user: req.user, block: req.body.block})
//   .populate('_address')
//   .exec(function (err, hypermarks) {
//     if (err) return console.log(new Error(err));
//     res.json('200', hypermarks);
//   });
// };


// getPublicBlock = function (req, res) {
//   Bookmark.find({block: req.body.block})
//   .populate('_address')
//   .exec(function (err, hypermarks) {
//     if (err) return console.log(new Error(err));
//     res.json('200', hypermarks);
//   });
// };


exports.searchHypermarks = function (req, res) {
  Address.search({
    query: req.query.q
  }, function (err, results) {
    if (err) {
      console.log(err);
      res.end('500');
    } else {
      res.json('200', results);
    }
  });
};
