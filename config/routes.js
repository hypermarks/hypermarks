'use strict';

//Middleware
var browserify = require('browserify-middleware')
  , auth = require('./middleware/auth')
;


// controllers
var home = require('../app/controllers/home.js')
  , users = require('../app/controllers/users')
  , api = require('../app/controllers/api.js')
  , pages = require('../app/controllers/pages.js')
;



module.exports = function (app, passport) {

  // //Home
  // app.get('/', home.index);
  // app.get('/poster', auth.requiresLogin, home.poster);


  //PAGES
  app.get('/', pages.home);
  // app.get('/search', pages.results);


  //API
  app.post('/api/hypermarks', api.postHypermark);
  app.get('/api/hypermarks', api.getHypermarks);
  app.get('/api/search', api.searchHypermarks);


  //AUTH
  app.get('/auth/external-login', users.externalLogin);
  app.post('/auth/logout', users.logout);
  app.post('/auth/browserid', passport.authenticate('persona'));


  //RESOURCES
  app.get('/permanent/bookmarklet.js', browserify('../bookmarklet/bookmarklet.js', {transform: ['simple-jadeify']}));




  //TEST PAGE
  app.get('/testpage', function (req, res) {
    console.log(req.user ? req.user.email : 'not logged in');
    res.render('testpage', {
      user: req.user
      , bookmarklet: require('../bookmarklet/loader.js')

    });
  });


};
