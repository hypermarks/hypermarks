var mongoose = require('mongoose')
  , elmongo = require('elmongo')
  , Schema = mongoose.Schema
;

var addressSchema = new Schema({
  url: String
  , sani_url: String
  , favicon: String
  , content: String
  , title: String
  , users: [ String ]
});

// add the plugin
addressSchema.plugin(elmongo, { host: 'localhost', port: 9200, prefix: 'test' });

module.exports = mongoose.model('Address', addressSchema);