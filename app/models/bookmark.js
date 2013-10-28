'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , helpers = require('../../logic/helpers.js')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
  , async = require('async')
  , Address = mongoose.model('Address')
  , User
;

var bookmarkSchema = new Schema({
    _address: { type: Schema.Types.ObjectId, ref: 'Address' }
  , _user: { type: Schema.Types.ObjectId, ref: 'User' }
  , _ancestor: Schema.Types.ObjectId
  , block: { type : String, set: blockSanitize, get: blockSanitize, default : '' }
  , chrome_extension_id : { type : Number }
  , sani_url: String
  , user_url: String //This is the url that the user submitted the bookmark with
  , createdAt: { type : Date, default : Date.now }
});

//SETTERS/GETTERS
function blockSanitize(block) {
  return stringUtils.sanitize(block);
}

//STATICS
bookmarkSchema.statics = {

  clone: function (address_id, bookmark_id, callback) {
    console.log(bookmark_id)
    var Self = this;
    Self.findById(bookmark_id, function (err, bookmark) {
      if (!bookmark) return callback(new Error('No bookmark found at this _id.'));

      opts._ancestor=bookmark_id;

      var merged = _.defaults(opts, bookmark.toObject());
      merged._id = undefined;

      new Self(merged).save(callback);
    });
  }

  ,

  move: function (bookmark_id, opts, callback) {
    this.findOneAndUpdate(bookmark_id, opts, callback);
  }

  ,

  getTimeline: function (user_id, callback) {
    this.find({_user: user_id, block:''})
    .sort('-_id')
    .populate('_address')
    .exec(callback);
  }

  ,

  create: function (opts, callback) {
    var bookmark = new this({
        _address: opts.address_id
      , _user: opts.user_id
      , sani_url: opts.sani_url
      , user_url: opts.user_url
      , chrome_extension_id: opts.chrome_extension_id
      , block : stringUtils.sanitize(opts.block) ? stringUtils.sanitize(opts.block): ''
    });
    bookmark.save(callback);
  }

  ,


  remove: function (opts, callback) {
    this.findOne({_id: opts._id})
    .exec(function(err, result){
      if (err) return callback(err);

      if (result === null || String(opts._user) !== String(result._user))
        callback({err: true});
      else
        result.remove(callback);
    });
  }

  ,

  getPrivateBlock: function (user_id, block, callback) {
    this.find({_user: user_id, block: stringUtils.sanitize(block)})
    .populate('_address')
    .exec(callback);
  }

  ,

  // getPublicBlock: function (block, callback) {
  //   this.find({block: stringUtils.sanitize(block)})
  //   .populate('_address')
  //   .exec(callback);
  // }

  // ,

  aggregatePublicBlock: function (block, callback) {
    if (typeof User==='undefined')
      User = mongoose.model('User');

    var Self = this,
    block=stringUtils.sanitize(block);
    Self
    .aggregate(
        { $match: { block: block } }
      //, { $sort : { createdAt : -1 } }
      , { $group: { _id: '$_address', count: { $sum: 1 }, firstPoster:{$first:'$_user'}, allPosters:{$addToSet:'$_user'} } }
      , { $sort: { count: -1 } }
    , function(err, results){
      //console.log('aggregatePublicBlock results 1', results)
      async.map(
        results
        , function (result, cb){
          Address.findById(result._id, function(err, _address){
            result._address = _address;
            cb(null, result);
          });
        }, function(err, results){
          //console.log('aggregatePublicBlock results 2', results)
         // console.log(results)
         // return
          callback(err, results);
        });
    });
  }

  ,

         



  //Pretty ridiculous. Refine into one aggregation (should be possible)
  recentlyUpdatedBlocks: function (callback) {
    var Self = this;
    
    // Get 5 most recently updated blocks 
    Self.aggregate(
        {$group: {_id: '$block', max_date: {$max: '$_id'}}}
      , {$sort: {max_date: -1}}
      , {$limit: 5}
      , function (err, results) {
        async.map(
            results
          , function (result, cb) {
            var block = result._id;

            // Get 5 most recently updated links in block
            Self.aggregate(
                {$match: {block: stringUtils.sanitize(block)}}
              , {$sort: {max_date: 1}}
              , {$group: {sani_url: {$max:'$sani_url'}, allPosters: {$addToSet:'$_user'}, firstPoster: {$first:'$_user'}, _id: '$_address', max_date: {$max: '$_id'}}}
              , {$limit: 5}
              
              , function (err, results) {

                // Retrieve addresses for results
                //console.log(results);
                //cb(err, results);

                async.map(
                    results
                  , function (result, cb) {
                    Address.findById(result._id)
                    .select('title working_url')
                    .exec(cb);
                  }
                  , function (err, result) {
                   // console.log(results, "results")
                   // console.log(result, "result")

                    var resultMerge=_.map(result, function(obj, i){
                      var newObj={};
                      newObj.title=obj.title;
                      newObj.working_url=obj.working_url;
                      newObj.allPosters=results[i].allPosters
                      newObj.firstPoster=results[i].firstPoster
                      newObj._id=obj._id;
                      return newObj

                      //console.log(obj,i)

                    });

                    //console.log(resultMerge)

                    var resultloc = {
                      //  allPosters: results[0].allPosters
                      //, firstPoster : results[0].firstPoster
                        block: block
                      , results: resultMerge
                    };
                    cb(err, resultloc);
                  }
                );
              }
            );
          }
          , function (err, results) {
            callback(err, results);
          }
        );
      }
    );
  }

  ,

  aggregateUserBlocks: function (user_id, callback) {
    var Self = this;
    Self.aggregate(
      { $group: {
        _id: '$block'
        , total_count: { $sum: 1 }
        , last_modified: { $max: '$_id' }
        , user_count: { $sum: { $cond: [ { $eq: [ '$_user', user_id ] } , 1, 0 ] } }
      }}

      , { $match : { _id : { $ne: '' } } }

      , function(err, results) {
        callback(err, results);
      }
    );
  }

  ,

  aggregateOneBlockCounts: function (user_id, block, callback) {
    var Self = this;
    // Groups all bookmarks in block on whether or not they belong to the user.
    Self.aggregate(
        { $match: { block: stringUtils.sanitize(block) } }
      , { $group: {
          _id: { $eq: [ '$_user', user_id ] }
        , count: { $sum: 1 }
      }}
      , function(err, results) {
        // Cleans up output
        var output = {}
          , my = _.find(results, { '_id': true })
          , other = _.find(results, { '_id': false });

        output.my = my ? my.count : 0;
        output.other = other ? other.count : 0;
        output.total = output.my + output.other;

        callback(err, output);
      }
    );
  }

};

module.exports = mongoose.model('Bookmark', bookmarkSchema);