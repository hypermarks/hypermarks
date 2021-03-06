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
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  favorite_blocks: [favoriteBlockSchema]

});


userSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password });



userSchema.methods = {


  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  getFavoriteBlocks: function () {
    console.log(this)
    if (this.favorite_blocks[0] !== null) return this.favorite_blocks;
    return false;
  },
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
    }
  }

};


userSchema.statics = {

  findByUsername: function (user_Name, cb) {
    this
      .findOne({username:user_Name})
      .exec(function(err, result){
        if (result)
          cb(null,result);
        else
          cb(null,result);
      })

  },

  findByEmail: function (user_Email, cb) {
    this
      .findOne({email:user_Email})
      .exec(function(err, result){
        if (result)
          cb(null,result);
        else
          cb(null,result);
      })

  },

  findByEmailorUsername: function (obj, cb) {
    this
      .findOne({ $or:[{username:obj.username}, {email:obj.email}] })
      .exec(function(err, result){
        if (result)
          cb(null,result);
        else
          cb(null,result);
      })

  },

  touchFavoriteBlock: function (user_id, block_id, cb) {
    var sanitized_block_id = stringUtils.sanitize(block_id);
    this.findById(
      user_id
      , function (err, user) {
        var favorite_blocks = user.favorite_blocks;
        var blockIndex = _.findIndex(favorite_blocks, {'_id': sanitized_block_id});
        console.log(user)
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
  },
  
  deleteFavoriteBlock: function (user_id, block_id, cb) {
    console.log(block_id)
        console.log(user_id)

    var sanitized_block_id = stringUtils.sanitize(block_id);
    this.findById(
      user_id
      , function (err, user) {
        var favorite_blocks = user.favorite_blocks;
        var blockIndex = _.findIndex(favorite_blocks, {'_id': sanitized_block_id});

        if (blockIndex !== -1) { //If the block does not yet exist
            favorite_blocks.splice(blockIndex, 1);
          }
        
        user.save(cb);
    });
  }


  

};



module.exports = mongoose.model('User', userSchema);
