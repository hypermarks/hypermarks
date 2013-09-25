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



  //API
  app.post('/_api/hypermarks', api.postHypermark);
  app.get('/_api/hypermarks', api.getTimeline);
  app.get('/_api/search', api.searchHypermarks);
  app.post('/_api/hypermarks/clone', api.addToBlock);


  app.get('/_api/blocks/:block', api.getPublicBlock);
  app.get('/_api/blocks/_private/:block', api.getPrivateBlock);
  app.post('/_api/blocks', api.addToBlock);

  app.get('/_api/users/favorites', api.getFavoriteBlocks);
  app.post('/_api/users/favorites', api.touchFavoriteBlock);

  app.get('/login', users.loginpage);
  app.get('/signup', users.signuppage);



  app.get('/:block', pages.publicBlock);


  //AUTH
  app.post('/_auth/logout', users.logout);
  app.post('/_auth/browserid', passport.authenticate('persona'));


  //RESOURCES
  //Caution! There could be any number of bookmarklets in the wild depending on this route!
  app.get('/_resources/bookmarklet.js', browserify('../public/bookmarklet/javascript/index.js', {transform: ['simple-jadeify']}));

  app.get('/_resources/site.js', browserify('../public/site/javascript/index.js', {transform: ['simple-jadeify']}));


  //PAGES
  app.get('/', pages.timeline);
  // app.get('/search', pages.results);
  app.get('/:block', pages.publicBlock);
};
