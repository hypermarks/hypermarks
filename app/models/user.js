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

  touchFavoriteBlock: function (block, cb) { //May need to do this differently - https://github.com/LearnBoost/mongoose/issues/315#issuecomment-985813
    var favorite_blocks = this.favorite_blocks;
    var blockIndex = _.findIndex(favorite_blocks, {'_id': block});

    if (blockIndex === -1) { //If the block does not yet exist
      favorite_blocks.push({
          _id: block
        , date_accessed: new Date()
      });
    } else {
      favorite_blocks[blockIndex].date_accessed = new Date();
    }

    this.save(cb);
  }

  ,

  getFavoriteBlocks: function () {
    return _.sortBy(this.favorite_blocks, 'date_accessed');
  }

};


module.exports = mongoose.model('User', userSchema);
