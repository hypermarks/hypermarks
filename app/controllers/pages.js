'use strict';
var config = require('../../config/config')()
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
  , Block = mongoose.model('Block')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
  , async = require('async')
;



function favoriteBlocks (user, callback) {
  // Uneccesary use of async, I know
  console.log('favoriteBlocks user', user)
  async.parallel({
    aggregated: function (callback) {
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



// exports.front = function (req, res) {
//   Bookmark.recentlyUpdatedBlocks(function (err, results) {
//     // var blocks=req.user.getFavoriteBlocks()
//     // var q={block: { $in: _.pluck(blocks,'_id') } };
//     // console.log(q);
//     // Block.find( q, function(err, BlockResults){
      
//     //   blockRespone=_.map(blocks,function(val){
//     //     var val.count=_.find(results,function(val2){ return val2.id==val._id});
//     //     return val

//     //   });
//     //   console.log(BlockResults)
//     return res.render('multi-list', {
//         user: req.user ? req.user : null
//       , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null        
//       , title: 'Home'
//       , results: results
//       , page_vars: {block: null}
//     });
//   });

// };

exports.front = function (req, res) {
    var user_id = req.user._id || null;
    async.parallel({
      user_lists: function (callback) {
        // if (!user_id) return callback(null, null);
        Bookmark.aggregateUserLists(req.user._id, function (err, results) {
          if (err) return callback(err);
          return callback(null, results);
        });
      },
      results: function (callback) {
        Bookmark.recentlyUpdatedBlocks(function (err, results) {
          if (err) return callback(err);
          return callback(null, results);
        });
      }
    },
    function (err, results) {
      if (err) return console.log(err);
      return res.render('multi-list', {
          user: req.user ? req.user : null
        , favorite_blocks: results.user_lists
        , results: results.results
        , title: 'Front Page'
        , page_vars: {block: null}
      });
    });
};


exports.tempDemo = function (req, res) {
  Bookmark.aggregateUserLists(req.user._id, function (err, results) {
    return res.send(results);
  });
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
    var block = req.url=="/"? stringUtils.sanitize('Unlisted'):stringUtils.sanitize(req.params.block);
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