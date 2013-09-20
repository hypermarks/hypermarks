'use strict';

/*!
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , PersonaStrategy = require('passport-persona').Strategy
  , User = mongoose.model('User')
  , debug = require('debug')('passport')
;

/**
 * Expose
 */

module.exports = function(passport) {

  //serialize sessions
  passport.serializeUser(function(user, done) {
    debug('passport.serializeUser', user);
    done(null, user.id);
  });

  //deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      debug('passport.deserializeUser', user);
      done(err, user);
    });
  });


  passport.use(new PersonaStrategy({
      audience: 'localhost:1337'
    },

    function(email, done) {
      User.findOne({
        'email': email
      }, function(err, user) {

        if (err) {
          return done(err);
        }

        if (!user) {
          user = new User({
            email: email
            , created: Date.now()
          });

          user.save(function(err) {
            if (err) {
              return done(err);
            } else {
              return done(null, user);
            }
          });

        } else {
          return done(null, user);
        }
      });
    }
  ));
};

