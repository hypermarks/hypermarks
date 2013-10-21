'use strict';
var config = require('../../config/config')()
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , User = mongoose.model('User')
  , Address = mongoose.model('Address')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
  , async = require('async')
;


//Gets user's blocks for sidebar
function userBlocks(user, callback) {
  if (!user) return callback(null, null);
  Bookmark.aggregateUserBlocks(user._id, function (err, results) {
    if (err) return callback(err);
      console.log( JSON.stringify( user.favorite_blocks) )
      console.log( JSON.stringify(results) )
    var union = _.union(user.favorite_blocks, results);
    var unionResult=_.indexBy(union, '_id');
    unionResult=_.map(unionResult,function(obj){
      if (!obj.user_count)
        obj.user_count=0;
      if (!obj.total_count)
        obj.total_count=0;
      return obj;
    });
    return callback(null, unionResult);
  });
};

exports.front = function (req, res) {
  var block = req.params.block
    , username = req.user ? req.user.username : null
  ;
  async.parallel({
    user_blocks: function (callback) {
      userBlocks(req.user, callback);
    },
    results: function (callback) {
      Bookmark.recentlyUpdatedBlocks(function (err, results) {
        if (err) return callback(err);
        return callback(null, results);
      });
    }}
    , function (err, results) {
      if (err) return console.log(err);
      return res.render('multi-list', {
          user: req.user
        , favorite_blocks: results.user_blocks
        , results: results.results
        , title: 'Front Page'
        , page_vars: {block: block, username: username}
      });
    }
  );
};


exports.publicBlock = function (req, res) {
  var block = req.params.block
    , username = req.user ? req.user.username : null
    , user_id = req.user ? req.user._id : null
  ;

  async.parallel({
    user_blocks: function (callback) {
      userBlocks(req.user, callback);
    }
    , results: function (callback) {
      Bookmark.aggregatePublicBlock(block, function (err, results) {
        if (err) return callback(err);
        return callback(null, results);
      });
    }
    , block_counts: function(callback) {
      Bookmark.aggregateOneBlockCounts(user_id, block, function (err, results) {
        return callback(err, results);
      });
    }
    }
    , function (err, results) {
      console.log('publicBlock block_counts', results.block_counts)
      if (err) return console.log(err);
      return res.render('list', {
          user: req.user
        , favorite_blocks: results.user_blocks
        , results: results.results
        , block: block
        , title: 'public/'+block
        , page_vars: {block: block, username: username}
        , block_counts: results.block_counts
      });
    }
  );
};


exports.tempDemo = function (req, res) {
  Bookmark.aggregateOneBlockCounts(req.body.user || req.user._id, req.body.block, function (err, results) {
    return res.send(results);
  });
};


exports.privateBlock = function (req, res) {
  var block = req.params.block
    , username = req.user ? req.user.username : null
    , user_id = req.user ? req.user._id : null
  ;

  if (username === req.params.user) {
    async.parallel({
      user_blocks: function (callback) {
        userBlocks(req.user, callback);
      }
      , results: function (callback) {
        Bookmark.getPrivateBlock(user_id, block, function (err, results) {
          if (err) return callback(err);
          return callback(null, results);
        });
      }
      , block_counts: function(callback) {
        Bookmark.aggregateOneBlockCounts(user_id, block, function (err, results) {
          return callback(err, results);
        });
      }
    }
    , function (err, results) {
      if (err) return console.log(err);
      return res.render('list', {
          user: req.user
        , favorite_blocks: results.user_blocks
        , results: results.results
        , private: true
        , block: block
        , title: username + '/' + block
        , page_vars: {block: block, username: username}
        , block_counts: results.block_counts
      });
    });
  } else {
    res.redirect('/' + req.params.block);
  }
};



// exports.search = function (req, res) {
//   Address.search({query: req.query.q}, function (err, results) {
//     if (err) console.log(err);
//     var hypermarks = _.map(results.hits, function(result) {
//       result._address = result._source;
//       delete result._source;
//       return result;
//     });
//     return res.render('search_results', {
//         user: (req.user) ? req.user : null
//       , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
//       , results: hypermarks
//       , title: 'Search'
//       , page: 'search'
//       , page_vars: {block:null, username:req.user.username}
//       , q: req.query.q
//     });
//   });
// };


exports.search = function (req, res) {
  var username = req.user ? req.user.username : null;

  async.parallel({
    user_blocks: function (callback) {
      userBlocks(req.user, callback);
    },
    results: function (callback) {
      Address.search({query: req.query.q}, function (err, results) {
        if (err) return callback(err);
        return callback(null, results);
      });
    }}
    , function (err, results) {
      if (err) return console.log(err);
      return res.render('multi-list', {
          user: (req.user) ? req.user : null
        , favorite_blocks: results.user_blocks
        , results: results.results
        , title: 'Search'
        , page_vars: {block: null, username: username}
        , q: req.query.q
      });
    }
  );
};