'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('lodash')
  , stringUtils = require('../../utils/string-utils.js')
;

var favoriteBlockSchema = new Schema({
    _id: String
  , date_accessed: Date
});

var userSchema = new Schema({
    email: String
  , favorite_blocks: [favoriteBlockSchema]
});



userSchema.methods = {

  getFavoriteBlocks: function () {
    if (this.favorite_blocks[0] !== null) return this.favorite_blocks;
    return false;
  }

};


userSchema.statics = {

  touchFavoriteBlock: function (user_id, block_id, cb) {
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
        user.save(cb);
    });
  }

};



module.exports = mongoose.model('User', userSchema);
