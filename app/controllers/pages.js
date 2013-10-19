'use strict';
var config = require('../../config/config')()
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
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
    return callback(null, results);
  });
}


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
    // , counts: function(callback) {
    //   if (req.user) {
    //     Bookmark.aggregateOneBlockCounts(user_id, block, function (err, results) {
    //       console.log(results);
    //       return callback(err, results);
    //     });
    //   } else {
    //     callback(null, null);
    //   }
    // }
    }
    , function (err, results) {
      if (err) return console.log(err);
      return res.render('list', {
          user: req.user
        , favorite_blocks: results.user_blocks
        , results: results.results
        , title: block
        , page_vars: {block: block, username: username}
      });
    }
  );
};

exports.tempDemo = function (req, res) {
  Bookmark.aggregateOneBlockCounts(req.user._id, req.body.block, function (err, results) {
    return res.send(results);
  });
};


// exports.privateBlock = function (req, res) {
//     var block = req.url == "/" ? stringUtils.sanitize('Unlisted') : stringUtils.sanitize(req.params.block);
//     Bookmark.getPrivateBlock(req.user._id, block, function (err, hypermarks) {
//       return res.render('list', {
//           user: req.user
//         , favorite_blocks: (req.user) ? req.user.getFavoriteBlocks() : null
//         , results: hypermarks
//         , title: block
//         , visibility: 'private'
//         , page: 'block'
//         , page_vars: {block: block, username:req.user.username}
//       });
//     });
// };


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
      // , public_count: function(callback) {
      //   if (req.user) {
      //     Bookmark.checkPublicBlock(user_id, block, function (err, results) {
      //       console.log(results);
      //       return callback(err, results);
      //     });
      //   } else {
      //     callback(null, null);
      //   }
      // }
    }
    , function (err, results) {
      if (err) return console.log(err);
      return res.render('list', {
          user: req.user
        , favorite_blocks: results.user_blocks
        , results: results.results
        , title: username + '/' + block
        , page_vars: {block: block, username: username}
        , public_count: results.public_count
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