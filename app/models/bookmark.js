'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , helpers = require('../../logic/helpers.js')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
  , async = require('async')
  , Address = mongoose.model('Address')
;

var bookmarkSchema = new Schema({
    _address: { type: Schema.Types.ObjectId, ref: 'Address' }
  , _user: { type: Schema.Types.ObjectId, ref: 'User' }
  , block: { type : String, set: blockSanitize, default : '' }
  , chrome_extension_id : { type : Number }
  , sani_url: String
  , user_url: String //This is the url that the user submitted the bookmark with
});

//SETTERS
function blockSanitize(block) {
  return stringUtils.sanitize(block);
}

//STATICS
bookmarkSchema.statics = {

  clone: function (bookmark_id, opts, callback) {
    var Self = this;
    Self.findById(bookmark_id, function (err, bookmark) {
      if (!bookmark) return callback(new Error('No bookmark found at this _id.'));
      
      var merged = _.defaults(opts, bookmark.toObject()); //TODO: Replace with lodash _.defaults
      merged._id = undefined; //So that mongo can set this

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
      , block : opts.block ? opts.block: ''
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
    this.find({_user: user_id, block: block})
    .populate('_address')
    .exec(callback);
  }

  ,

  getPublicBlock: function (block, callback) {
    this.find({block: block})
    .populate('_address')
    .exec(callback);
  }

  ,

  aggregatePublicBlock: function (block, callback) {
    var Self = this;
    Self.aggregate(
        {$match: {block: block}}
      , {$group: {_id: '$_address', count: {$sum: 1}}}
      , {$sort: {count: -1}}
    , function(err, results){
      async.map(
        results
        , function(result, cb){
          Address.findById(result._id, function(err, _address){
            result._address = _address;
            cb(null, result);
          });
        }
        , function(err, results){
          callback(err, results);
        });
    });
  }

};

module.exports = mongoose.model('Bookmark', bookmarkSchema);