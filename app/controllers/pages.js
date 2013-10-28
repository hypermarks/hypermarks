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


    //   // console.log( JSON.stringify( user.favorite_blocks) )
    //   // console.log( JSON.stringify(results) )
    // var favorite_blocks=user.favorite_blocks;
    // //var union = _.union(results, favorite_blocks);
    // // var unionResult=_.indexBy(union, '_id');
    // //console.log(favorite_blocks)

    // //console.log(results)
    // //return    

    var unionResult=_.map(user.favorite_blocks,function(fav_obj){

       var where_Res=_.findWhere(results,{_id: fav_obj._id.toLowerCase() });
         if (where_Res!==undefined)
            fav_obj.user_count=where_Res.user_count,
            fav_obj.total_count=where_Res.total_count,  //_.assign(where_Res, fav_obj);
            fav_obj.date_accessed=where_Res.date_accessed;   //_.assign(where_Res, fav_obj);



      if (!fav_obj.user_count)
        fav_obj.user_count=0;
      if (!fav_obj.total_count)
        fav_obj.total_count=0;
      return fav_obj;
    });
    return callback(null, unionResult);
  });
};

exports.feed = function (req, res) {
  var block = req.params.block
    , username = req.user ? req.user.username : null
  ;
  async.parallel({
    user_blocks: function (callback) {
      userBlocks(req.user, callback);
     },
     feed_marks: function (callback) {
      if (!req.user) { callback(null, null); return; }

      var blocks=_.map(req.user.favorite_blocks,function(obj){ return obj._id.toLowerCase()});
      console.log(blocks)

      Bookmark
        .find({block:{$in:blocks}})
        .sort('-createdAt')
        .exec(function(err, results){
          
          callback(err,results);

        });

      //notifications(req.user, callback);
     }
    }
    , function (err, results) {
      if (err) return console.log(err);
      return res.render('feed', {
          user: req.user
        , favorite_blocks: results.user_blocks
        , feed_marks: results.feed_marks
        , results: results.results
        , title: 'Feed'
        , page_vars: {block: block, username: username}
      });
    }
  );
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

    //    console.log(results);


        async.map(
        results
        , function (result, cb){


          console.log(result.results,"res");
          var user_ids;
          if (result.results.length===1){
            user_ids=result.results[0].allPosters
          } else {
            user_ids=_.reduce(result.results, function(memo, num){ return memo.allPosters.concat(num.allPosters) });
          }

         console.log(user_ids, "ids")
     //     return

          User.find({_id:{$in:user_ids}}, function(err, _users){
              _users = JSON.parse(JSON.stringify(_users));



            var newResult = JSON.parse(JSON.stringify(result));

            newResult.results=_.map(newResult.results, function(obj){
              

              var current_user= req.user? _.findWhere(_users, {_id:String(req.user._id)}):undefined;
              obj.current_user_posted= current_user? true:false;
              
              var firstPost=_.findWhere(_users, {_id:obj.firstPoster});
              obj.firstPoster={username: firstPost.username, _id: firstPost._id};

              obj.allPosters=_.map(obj.allPosters, function(objRes){

                


                var user=_.findWhere(_users, {_id:objRes});

                objRes={username:user.username, _id:user._id};


                return objRes;

              });

              console.log(obj.allPosters)

              return obj;


            });
            //console.log(newResult.results[0].allPosters,"result2")

            cb(null,newResult);


          });

          


        }, function(err, results){
          //console.log('aggregatePublicBlock results 2', results)
          if (err) return callback(err);
          return callback(null, results);

        });


        //return callback(null, results);
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

        async.map(
        results
        , function (result, cb){

          User.find({_id:{$in:result.allPosters}}, function(err, _users){
            var _firstusers=_.findWhere(_users, {_id:result.firstPoster});
            //console.log(_.findWhere(_users, {_id:req.user._id}))
            var current_user= req.user? _.findWhere(_users, {_id:req.user._id}):undefined;
            result.current_user_posted= current_user? true:false;
            result.firstPoster={_id:_firstusers._id, username:_firstusers.username};
            result.allPosters=_.map(result.allPosters, function(obj){
              var _user=_.findWhere(_users, {_id:obj} );
              return {_id:_user._id, username:_user.username};
           });

           //result.allPosters
            
            cb(null, result);
          });
        }, function(err, results){
          //console.log('aggregatePublicBlock results 2', results)
          if (err) return callback(err);
          return callback(null, results);

        });


        
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