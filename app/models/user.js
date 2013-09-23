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
  // , favorite_blocks: [ Object ]
});


userSchema.methods = {

  getFavoriteBlocks: function () {
    return _.sortBy(this.favorite_blocks, 'date_accessed');
  }

};


userSchema.statics = {

  // touchFavoriteBlock: function (user_id, block_id, cb) {
  //   console.log(user_id, block_id, cb)
  //   var Self = this;
  //   Self.findById(
  //     user_id
  //     , function (err, user) {
  //       console.log(err, user)
  //       var block = user.favorite_blocks.id(block_id);
  //       if (!block) {
  //         console.log('noblock')
  //         block = user.favorite_blocks.create({ _id: block_id });
  //         console.log(block)
  //       }

  //       block.date_accessed = new Date();
  //       console.log(block, user)
  //       return user.save(cb);
  //   });
  // }

  touchFavoriteBlock: function (user_id, block_id, cb) {
    this.findById(
      user_id
      , function (err, user) {
        var favorite_blocks = user.favorite_blocks;
        var blockIndex = _.findIndex(favorite_blocks, {'_id': block_id});

        console.log(favorite_blocks, blockIndex);

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

  // touchFavoriteBlock: function (user_id, block_id, cb) {
  //   // var block = 'favorite_blocks.' + block_id;
  //   this.findById(
  //     user_id
  //     , function (err, user) {
  //       user.favorite_blocks[block_id] = new Date();
  //       user.save(cb);
  //     }
  //   );
  // }

};





// touchFavoriteBlock: function (block, cb) { //May need to do this differently - https://github.com/LearnBoost/mongoose/issues/315#issuecomment-985813
//   var favorite_blocks = this.favorite_blocks;
//   var blockIndex = _.findIndex(favorite_blocks, {'_id': block});

//   if (blockIndex === -1) { //If the block does not yet exist
//     favorite_blocks.push({
//         _id: block
//       , date_accessed: new Date()
//     });
//   } else {
//     favorite_blocks[blockIndex].date_accessed = new Date();
//   }

//   this.save(cb);
// }


module.exports = mongoose.model('User', userSchema);
