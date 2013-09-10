/**
 * Module dependencies.
 */
'use strict';

var browserify = require('browserify-middleware');
var auth = require('./middleware/auth');


// controllers
var home = require('../app/controllers/home.js'); //This is because I don't want to disturb the home.js controller right now.
var users = require('../app/controllers/users');
var hypermarks = require('../app/controllers/hypermarks.js');


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
  app.post('/api/bookmarks', hypermarks.newHypermark);

  app.get('/auth/externalLogin', users.externalLogin);
  app.post('/auth/logout', users.logout);

  app.post('/auth/browserid', passport.authenticate('persona'));



  //TEST PAGE
  app.get('/testpage', function (req, res) {
    console.log(req.user ? req.user.email : 'not logged in');
    res.render('testpage', {
      user: req.user
      , bookmarklet: require('../external/loader.js')

    });
  });


};
