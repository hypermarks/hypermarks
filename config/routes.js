'use strict';

//Middleware
var browserify = require('browserify-middleware');


// controllers
var users = require('../app/controllers/users')
  , api = require('../app/controllers/api.js')
  , pages = require('../app/controllers/pages.js')
;



module.exports = function (app, passport) {

  //PAGES
  app.get('/', pages.timeline);
  // app.get('/search', pages.results);

  app.post('/api/blocks', api.addToBlock);

  //API
  app.post('/api/hypermarks', api.postHypermark);
  app.get('/api/hypermarks', api.getTimeline);
  app.get('/api/search', api.searchHypermarks);
  app.post('/api/hypermarks/clone', api.addToBlock);


  app.get('/api/buckets/:block', api.getPublicBlock);
  app.get('/api/buckets/_private/:block', api.getPrivateBlock);

  app.get('/api/users/favorites', api.getFavoriteBlocks);
  app.post('/api/users/favorites', api.touchFavoriteBlock);


  //AUTH
  app.get('/auth/external-login', users.externalLogin);
  app.post('/auth/logout', users.logout);
  app.post('/auth/browserid', passport.authenticate('persona'));


  //RESOURCES
  app.get('/permanent/bookmarklet.js', browserify('../bookmarklet/bookmarklet.js', {transform: ['simple-jadeify']}));

};
