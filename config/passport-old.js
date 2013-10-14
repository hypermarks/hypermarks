'use strict';

/*!
 * Module dependencies.
 */

var env = process.env.NODE_ENV || 'development'
  // , config = require('../config/config')()
  , mongoose = require('mongoose')
  , PersonaStrategy = require('passport-persona').Strategy
  , LocalStrategy = require('passport-local').Strategy
  , User = mongoose.model('User')
;

/**
 * Expose
 */

module.exports = function(passport, config) {

  //serialize sessions
  passport.serializeUser(function(user, done) {
    console.log('passport.serializeUser', user);
    done(null, user.id);
  });

  //deserialize sessions
  passport.deserializeUser(function(id, done) {

    User.findById(id, function(err, user) {
      console.log('passport.deserializeUser', user);
      done(err, user);
    });
  });


  // // use local strategy
  // passport.use(new LocalStrategy({
  //     usernameField: 'email',
  //     passwordField: 'password'
  //   },
  //   function(email, password, done) {
  //     User.findOne({ email: email }, function (err, user) {
  //       if (err) return done(err);
  //       if (!user) {
  //         return done(null, false, { message: 'Unknown user' });
  //       }
  //       if (!user.authenticate(password)) {
  //         return done(null, false, { message: 'Invalid password' });
  //       }
  //       return done(null, user);
  //     });
  //   }
  // ));


  // passport.use(new PersonaStrategy({
  //     audience: config.url
  //   },

  //   function(email, done) {
  //     console.log('PersonaStrategy config.url', config.url);
  //     User.findOne({
  //       'email': email
  //     }, function(err, user) {
  //       console.log('passport find user', user)
  //       if (err) {
  //         console.log(err)
  //         return done(err);
  //       }

  //       if (!user) {
  //         user = new User({
  //           email: email
  //           , created: Date.now()
  //         });

  //         console.log('passport new user', user)

  //         user.save(function(err) {
  //           if (err) {
  //             return done(err);
  //           } else {
  //             return done(null, user);
  //           }
  //         });

  //       } else {
  //         console.log('passport old user', user)
  //         return done(null, user);
  //       }
  //     });
  //   }
  // ));
};

