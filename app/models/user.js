var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var bookmarkSchema = new Schema({
	address: { type: Schema.ObjectId, ref: 'Address'}
  	, url: String
	, created: { type : Date, default : Date.now }
});

var userSchema = new Schema({
  email: String
  , created: { type : Date, default : Date.now }
  , searches: [String]
  , bookmarks: [bookmarkSchema]
});


module.exports = mongoose.model('User', userSchema);
