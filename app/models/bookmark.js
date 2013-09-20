'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , helpers = require('../../logic/helpers.js')
  , debug = require('debug')('bookmark_model')
;

var bookmarkSchema = new Schema({
    _address: { type: Schema.Types.ObjectId, ref: 'Address' }
  , _user: { type: Schema.Types.ObjectId, ref: 'User' }
  , block: { type : String, default : '' }
  , sani_url: String
  , user_url: String //This is the url that the user submitted the bookmark with
});

// bookmarkSchema.methods = {

// };

bookmarkSchema.statics = {

  clone: function (source, opts, cb) {
    var merged = helpers.mergeOptions(source.toObject(), opts);
    merged._id = undefined; //Hardwired because it needs to be.
    console.log(merged)
    new this(merged).save(cb);
  }

  ,

  getTimeline: function (user_id, cb) {
    this.find({_user: user_id, block: ''})
    .sort('_id')
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

    console.log('saved bookmark: ', bookmark);
    return bookmark.save(cb);
  }

  ,

  getPrivateBlock: function (user_id, block, cb) {
    this.find({_user: user_id, block: block})
    .populate('_address')
    .exec(cb);
  }

  ,

  getPublicBlock: function (block, cb) {
    console.log(block)
    this.find({block: block})
    .populate('_address')
    .exec(cb);
  }

};

module.exports = mongoose.model('Bookmark', bookmarkSchema);