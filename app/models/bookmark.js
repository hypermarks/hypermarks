'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , helpers = require('../../logic/helpers.js')
  , stringUtils = require('../../utils/string-utils.js')
  , _ = require('lodash')
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

//UTILITY
function unwrapAddress(results) {
  return _.map(results, function(result){
    _.assign(result, result._address);
  });
}

bookmarkSchema.statics = {

  clone: function (source, opts, cb) {
    var merged = helpers.mergeOptions(source.toObject(), opts); //TODO: Replace with lodash _.defaults
    merged._id = undefined; //So that mongo can set this
    console.log(merged);
    new this(merged).save(cb);
  }

  ,

  getTimeline: function (user_id, cb) {
    this.find({_user: user_id, block: ''})
    .sort('-_id')
    .populate('_address')
    .exec(cb);
  }

  ,

  create: function (opts, cb) {
    var bookmark = new this({
        _address: opts.address_id
      , _user: opts.user_id
      , sani_url: opts.sani_url
      , user_url: opts.user_url
    });

    bookmark.save(cb);
  }

  ,

  getPrivateBlock: function (user_id, block, cb) {
    this.find({_user: user_id, block: block})
    .populate('_address')
    .exec(cb);
  }

  ,

  //Need to add in MR or something here.
  getPublicBlock: function (block, cb) {
    console.log(block)
    this.find({block: block})
    .populate('_address')
    .exec(cb);
  }

};

module.exports = mongoose.model('Bookmark', bookmarkSchema);