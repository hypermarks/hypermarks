'use strict';

//Middleware
//var browserify = require('browserify-middleware');


// controllers
var users = require('../app/controllers/users')
  , api = require('../app/controllers/api.js')
  , pages = require('../app/controllers/pages.js');



module.exports = function (app, passport) {

  // Order of routes matters!!!!

  //API
  app.post('/_api/hypermarksChrome', api.postHypermarkChrome);
  
  app.post('/_api/hypermarks/add', api.postHypermark);
  app.get('/_api/post', api.imagePost);

  app.post('/_api/hypermarks/remove', api.removeHypermark);
  app.post('/_api/hypermarks/clone', api.cloneToBlock);
  app.post('/_api/hypermarks/move', api.moveToBlock);

  app.post('/_api/favorites/add', api.touchFavoriteBlock);
  app.post('/_api/favorites/delete', api.deleteFavoriteBlock);



  //Eoin's reservation page depends on this
  app.post('/_api/users/reserve', api.reserveUsername);

  app.get('/_auth/login', users.loginpage);
  app.get('/_auth/signup', users.signuppage);
  app.post('/_auth/users', users.create);


  //AUTH
  app.post('/_auth/logout', users.logout);

  app.post('/_auth/localauth',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);

  app.get('/_auth/external-login', users.externalLogin);


  //PAGES
  app.get('/', pages.front);
  app.get('/_my/uncategorized', pages.uncategorized);
  app.get('/_search', pages.search);
  app.get('/_my/:block', pages.privateBlock);
  app.get('/:block', pages.publicBlock);
};
