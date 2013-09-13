'use strict';

var browserify = require('browserify-middleware')
;


//Middleware
var auth = require('./middleware/auth');

// controllers
var home = require('../app/controllers/home.js');
var users = require('../app/controllers/users');
var hypermarks = require('../app/controllers/hypermarks.js');



module.exports = function (app, passport) {

  //Home
  app.get('/', home.index);
  app.get('/poster', auth.requiresLogin, home.poster);

  //Submit new hypermark
  app.post('/api/bookmarks', hypermarks.postHypermark);

  app.get('/auth/externalLogin', users.externalLogin);
  app.post('/auth/logout', users.logout);

  app.get('/permanent/bookmarklet.js', browserify('../bookmarklet/main.js'));

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
