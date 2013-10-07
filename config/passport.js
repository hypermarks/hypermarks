'use strict';

/*!
 * Module dependencies.
 */

var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')
  , PersonaStrategy = require('passport-persona').Strategy
  , User = mongoose.model('User')
;

/**
 * Expose
 */

module.exports = function(passport) {

  //serialize sessions
  passport.serializeUser(function(user, done) {
    console.log('passport.serializeUser', user);
    done(null, user.id);
  });

  //deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log('passport.deserializeUser', user.email);
      done(err, user);
    });
  });


  passport.use(new PersonaStrategy({
      audience: config.hostDomain
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

