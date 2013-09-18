var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var blockSchema = new Schema({
    _id: String
  , accessed: Date
});

var userSchema = new Schema({
  email: String
  , _blocks: [blockSchema]
});

module.exports = mongoose.model('User', userSchema);
