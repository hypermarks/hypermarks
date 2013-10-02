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
  , sani_url: String
  , user_url: String //This is the url that the user submitted the bookmark with
});

//SETTERS
function blockSanitize(block) {
  return stringUtils.sanitize(block);
}

bookmarkSchema.statics = {

  clone: function (source, opts, callback) {
    var merged = helpers.mergeOptions(source.toObject(), opts); //TODO: Replace with lodash _.defaults
    merged._id = undefined; //So that mongo can set this
    console.log(merged);
    new this(merged).save(callback);
  }

  ,

  getTimeline: function (user_id, callback) {
    this.find({_user: user_id, block: ''})
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
    });

    bookmark.save(callback);
  }

  ,

  getPrivateBlock: function (user_id, block, callback) {
    this.find({_user: user_id, block: block})
    .populate('_address')
    .exec(callback);
  }

  ,

  //Need to add in MR or something here.
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