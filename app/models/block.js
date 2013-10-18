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
    block: { type : String, set: blockSanitize, default : '' }
  , count : { type : Number, default : 1 }

});

function blockSanitize(block) {
  return stringUtils.sanitize(block);
}

//STATICS
bookmarkSchema.statics = {


  updateCreate: function (block_id, callback) {
      console.log(block_id, "create")

    var Self = this;
   
    Self.findOne({block:block_id}, function (err, block) {

      if (block){

        block.count+=1;

         block.save(function(err){
          if(callback)callback(err);
        });
      }else{
          var newBlock = new Self({block:block_id});
          newBlock.save(function(err){
            
            if(callback) callback(err);
          });
        }
    });
  },
  updateDecrement: function (block_id, callback) {
      console.log(block_id, "create")

    var Self = this;
   
    Self.findOne({block:block_id}, function (err, block) {

      if (block){

        block.count-=1;
         block.save(function(err){
          if(callback)callback(err);
        });
      }
    });
  },



};

module.exports = mongoose.model('Block', bookmarkSchema);