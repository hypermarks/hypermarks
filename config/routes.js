/**
 * Module dependencies.
 */
'use strict';

var browserify = require('browserify-middleware');
var auth = require('./middleware/auth');


// controllers
var home = require('../app/controllers/home.js'); //This is because I don't want to disturb the home.js controller right now.
var newHypermark = require('../app/controllers/new-hypermark');
var users = require('../app/controllers/users');


/**
 * Expose
 */

module.exports = function (app, passport) {

  //Home
  app.get('/', auth.requiresLogin, home.index);
  app.get('/poster', auth.requiresLogin, home.poster);


  //Browserify bookmarklet code
  app.get('/permanent/bookmarklet.js', browserify('../external/bookmarklet.js'));

  //Submit new hypermark
  app.post('/api/bookmarks', auth.requiresLogin, function(req, res) {
    newHypermark(req.body.url, 'hello', req.user, function(err){
      if (err) return res.end(err); //TODO: possibly do something better with this.
      return res.end('success'); //TODO: Replace with something useful
    });
  });

  app.get('/auth/login', users.login);
  app.post('/auth/logout', users.logout);




  //TEST PAGE
  app.get('/testpage', function (req, res) {
    console.log(req.user ? req.user.email : 'not logged in');
    res.render('testpage', {
      user: req.user
      , bookmarklet: require('../external/loader.js')

    });
  });



  app.post('/auth/browserid',
    passport.authenticate('persona', {
      failureRedirect: '/'
    }),
    function (req, res) {
      res.redirect('/');
    }
  );

};
