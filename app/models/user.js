var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String
  , created: Date
});


module.exports = mongoose.model('User', userSchema);
