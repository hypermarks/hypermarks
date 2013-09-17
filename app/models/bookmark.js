var mongoose = require('mongoose')
  , Schema = mongoose.Schema
;

var bookmarkSchema = new Schema({
  address: {type: Schema.ObjectId, ref: 'Address'}
  , user: {type: Schema.ObjectId, ref: 'User'}
  , sani_url: String
  , working_url: String
  , add_date: Date
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);