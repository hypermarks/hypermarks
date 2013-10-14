'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('lodash')
  , stringUtils = require('../../utils/string-utils.js')
  , passportLocalMongoose = require('passport-local-mongoose')
;

var favoriteBlockSchema = new Schema({
    _id: String
  // , date_accessed: Date
  , sort_order: Number
});

var userSchema = new Schema({
    email: String
  , created: Date
  , favorite_blocks: [favoriteBlockSchema]
});



userSchema.methods = {

  getFavoriteBlocks: function () {
    if (this.favorite_blocks[0] !== null) return this.favorite_blocks;
    return false;
  }

  ,

  updateFavoriteBlocks: function (new_favorite_blocks) {
    console.log('updateFavoriteBlocks new_favorite_blocks, this', new_favorite_blocks, this)
    this.favorite_blocks = JSON.parse(new_favorite_blocks);
    this.save();
  }
  
};


userSchema.statics = {

  touchFavoriteBlock: function (user_id, block_id, callback) {
    var sanitized_block_id = stringUtils.sanitize(block_id);
    this.findById(
      user_id
      , function (err, user) {
        var favorite_blocks = user.favorite_blocks;
        var blockIndex = _.findIndex(favorite_blocks, {'_id': sanitized_block_id});

        if (blockIndex === -1) { //If the block does not yet exist
          favorite_blocks.push({
              '_id': sanitized_block_id
            , 'date_accessed': new Date()
          });
        } else {
          favorite_blocks[blockIndex].date_accessed = new Date();
        }
        user.save(callback);
    });
  }

};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
