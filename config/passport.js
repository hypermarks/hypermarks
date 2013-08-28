
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose')
var PersonaStrategy = require('passport-persona').Strategy;
var User = mongoose.model('User')

/**
 * Expose
 */

module.exports = function (passport, config) {
  // serialize sessions
  passport.serializeUser(function(user, done) {
    console.log('serializeUser', user)
    done(null, user.id)
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id)
    User.findById(id, function (err, user) {
      done(err, user)
    })
  });


  passport.use(new PersonaStrategy({
      audience: 'localhost:3000'
    },

    function (email, done) {
      console.log('Strategy CB')
      var options = {
        'email': email
      };

      User.findOne(options, function (err, user) {
        if (err) { return done(err) }

        if (!user) {
          user = new User({
              email: email
            , created: Date.now()
          })

          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }

        return done(null, user)
      });
    }
  ));

}
