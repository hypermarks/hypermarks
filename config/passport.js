var mongoose = require('mongoose')
  , User = mongoose.model('User')
;

module.exports = function(passport) {
  //These are coming from a plugin on the user model
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
}