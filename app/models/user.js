var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var bookmarkSchema = new Schema({
	address: { type: Schema.ObjectId, ref: 'Address'}
  , url: String
	, created: Date
});

var userSchema = new Schema({
  email: String
  , created: Date
  , searches: [String]
  , bookmarks: [bookmarkSchema]
});


module.exports = mongoose.model('User', userSchema);
