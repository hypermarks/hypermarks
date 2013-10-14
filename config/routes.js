'use strict';

//Middleware
var browserify = require('browserify-middleware');


// controllers
var users = require('../app/controllers/users')
  , api = require('../app/controllers/api.js')
  , pages = require('../app/controllers/pages.js');



module.exports = function (app, passport) {

  // app.all('/*', function (req, res) {
  //   console.log(req, res);
  // })

  //API
  app.post('/_api/hypermarks', api.postHypermark);
  app.post('/_api/hypermarksChrome', api.postHypermarkChrome);
  app.post('/_api/hypermarksRemove', api.removeHypermark);

  app.get('/_api/hypermarks', api.getTimeline);
  app.get('/_api/search', api.searchHypermarks);
  app.post('/_api/hypermarks/clone', api.addToBlock);


  app.get('/_api/post', api.imagePost);



  app.get('/_api/blocks/:block', api.getPublicBlock);
  app.get('/_api/blocks/_p/:block', api.getPrivateBlock);
  app.post('/_api/blocks', api.addToBlock);

  app.get('/_api/users/favorites', api.getFavoriteBlocks);
  app.post('/_api/users/favorites', api.updateFavoriteBlocks);

  app.post('/_api/users/reserve', api.reserveUsername);

  //incorrectly namespaced- will deal with in a bit
  // app.get('/login', users.loginpage);
  // app.get('/signup', users.signuppage);
  // app.post('/users', users.create);


  //AUTH
  app.post('/_auth/logout', users.logout);
  app.post('/_auth/browserid', passport.authenticate('persona'));

  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);

  app.get('/_auth/external-login', users.externalLogin);


  //RESOURCES
  //Caution! There could be any number of bookmarklets in the wild depending on this route!
  app.get('/_resources/bookmarklet.js', browserify('../app/frontend/bookmarklet/index.js', {transform: ['simple-jadeify', 'envify']}));

  app.get('/_resources/site.js', browserify('../app/frontend/site/index.js', {transform: ['simple-jadeify']}));


  //PAGES
  app.get('/', pages.timeline);
  app.get('/_search', pages.search);
  app.get('/_my/:block', pages.privateBlock);
  app.get('/:block', pages.publicBlock);
};
