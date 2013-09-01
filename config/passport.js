/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var PersonaStrategy = require('passport-persona').Strategy;
var User = mongoose.model('User');

/**
 * Expose
 */

module.exports = function(passport, config) {

  //serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  });

  //deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user)
    })
  });


  passport.use(new PersonaStrategy({
      audience: 'localhost:1337'
    },

    function(email, done) {
      User.findOne({
        'email': email
      }, function(err, user) {
        console.log(user._id)
        if (err) {
          return done(err)
        }

        if (!user) {
          user = new User({
            email: email,
            created: Date.now()
          })

          user.save(function(err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }

        return done(null, user)
      });
    }
  ));
}

