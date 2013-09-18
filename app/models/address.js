var mongoose = require('mongoose')
  , elmongo = require('elmongo')
  , Schema = mongoose.Schema
;

var addressSchema = new Schema({
    sani_url: String
  , working_url: String
  , favicon: String
  , content: String
  , title: String
  , users: [ String ]
  , blocks: [ String ]
});

// add the plugin
addressSchema.plugin(elmongo, { host: 'localhost', port: 9200, prefix: 'test' });

module.exports = mongoose.model('Address', addressSchema);