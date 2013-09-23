'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('lodash')
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
    return _.sortBy(this.favorite_blocks, 'date_accessed');
  }

};


userSchema.statics = {

  touchFavoriteBlock: function (user_id, block_id, cb) {
    this.findById(
      user_id
      , function (err, user) {
        var favorite_blocks = user.favorite_blocks;
        var blockIndex = _.findIndex(favorite_blocks, {'_id': block_id});

        if (blockIndex === -1) { //If the block does not yet exist
          favorite_blocks.push({
              '_id': block_id
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
