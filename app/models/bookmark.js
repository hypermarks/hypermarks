var mongoose = require('mongoose')
  , Schema = mongoose.Schema
;

var bookmarkSchema = new Schema({
    _address: { type: Schema.Types.ObjectId, ref: 'Address' }
  , _user: { type: Schema.Types.ObjectId, ref: 'User' }
  , sani_url: String
  , user_url: String //This is the url that the user submitted the bookmark with
  , block: String
  // , add_date: Date
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);