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

function favoriteBlocks (user, callback) {
  // Uneccesary use of async, I know
  console.log('favoriteBlocks user', user)
  async.parallel({
    aggregated: function (callback) {
      // This is a possible source of slowness,
      // we need to figure something out here.
      Bookmark.aggregateUserLists(user._id, function (err, results) {
        if (err) return callback(err);
        callback(null, results);
      });
    },
    sorted: function (callback) {
      console.log('favoriteBlocks sorted', user.getFavoriteBlocks())
      callback(null, user.getFavoriteBlocks());
    }
  },

  function (err, results){
    if (err) return console.log(err);
    var zipped = _.forEach(results.aggregated, function(result) {
      console.log('favoriteBlocks result, results', result, results)
      var sort = results.sorted ? _.find(results.sorted, {'_id': result._id}) : {sort_order: 0}; //Find the sorted block with the right _id, or make one with 0
      result.sort_order = sort.sort_order; //Assign sort order to result, fusing the arrays
      return result;
    });
    // Then we sort them in the real order and call back
    callback(null, _.sortBy(zipped, 'sort_order'));
  });
}


 
exports.timeline = function (req, res) {
  console.log('timeline req.user', req.user);
  if (req.user) {
    console.log('timeline req.user._id', req.user._id)
    async.parallel({
      favorite_blocks: function (callback) {
        favoriteBlocks(req.user, function (err, results) {
          if (err) return callback(err);
          callback(null, results);
        });
      },
      hypermarks: function (callback) {
        Bookmark.getTimeline(req.user._id, function (err, results) {
          if (err) return callback(err);
          callback(null, results);
        });
      }
    },
    function (err, results) {
      console.log('timeline results.favorite_blocks', results.favorite_blocks)
      if (err) return console.log(err);
      return res.render('list', {
          user: req.user
        , bm_loader: bm_loader(config.url)
        , favorite_blocks: results.favorite_blocks
        , results: results.hypermarks
        , title: 'Timeline'
  //       , page: 'timeline'
      });
    });
  } else {
    return res.render('login');
  }
};



exports.publicBlock = function (req, res) {
  var block = stringUtils.sanitize(req.params.block);
  
  async.parallel({
    aggregatePublicBlock: function(callback) {
      Bookmark.aggregatePublicBlock(block, function (err, results) {
        callback(err, results);
      });
    },
    checkPrivateBlock: function(callback) {
      if (req.user) {
        Bookmark.checkPrivateBlock(req.user._id, block, function (err, results) {
          console.log(results);
          return callback(err, results);
        });
      } else {
        callback(null, null);
      }
    }
  },

  function (err, results) {
    var private_check;
    if (results.checkPrivateBlock.length) private_check = true;
    return res.render('list', {
        user: req.user
      , bm_loader: bm_loader(config.url)
      , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
      , results: results.aggregatePublicBlock
      , title: block
      , visibility: 'private'
//       , page: 'block'
      , private_check: private_check ? 'private' : 'unprivate'
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
          // console.log('checkPublicBlock', hypermarks);
          callback(err, hypermarks);
        });
      }
    },

    function (err, results) {
      // console.log('checkPublicBlock ', results.checkPublicBlock)
      var public_check;
      if (results.checkPublicBlock.length) public_check = true;
      return res.render('list', {
          user: req.user
        , bm_loader: bm_loader(config.url)
        , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
        , results: results.getPrivateBlock
        , title: block
        , is_private: true
  //       , page: 'block'
        , public_check: public_check
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
//       , page: 'search'
    });
  });
};