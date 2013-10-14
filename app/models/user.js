'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('lodash')
  , stringUtils = require('../../utils/string-utils.js')
;

var favoriteBlockSchema = new Schema({
    _id: String
  , date_accessed: Date
  , sort_order: Number
});

var userSchema = new Schema({
    email: String
  , favorite_blocks: [favoriteBlockSchema]
});



userSchema.methods = {

  getFavoriteBlocks: function () {
    return _.sortBy(this.favorite_blocks, 'date_accessed').reverse();
  }

  ,

  updateFavoriteBlocks: function (new_favorite_blocks, callback) {
    this.favorite_blocks = new_favorite_blocks;
    this.save(callback);
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



module.exports = mongoose.model('User', userSchema);
