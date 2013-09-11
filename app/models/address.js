var mongoose = require('mongoose')
  , mongoosastic = require('mongoosastic')
  , Schema = mongoose.Schema
  ;

var addressSchema = new Schema({
  url: String
  , sani_url: String
  , favicon: String
  , content: { type: String, es_indexed: true }
  , title: { type: String, es_indexed: true }
  , users: { type: [String], es_indexed: true }
});

// add the mongoosastic plugin
addressSchema.plugin(mongoosastic);

module.exports = mongoose.model('Address', addressSchema);