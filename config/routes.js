'use strict';

//Middleware
var browserify = require('browserify-middleware');


// controllers
var users = require('../app/controllers/users')
  , api = require('../app/controllers/api.js')
  , pages = require('../app/controllers/pages.js')
;



module.exports = function (app, passport) {


  app.post('/tester', function(req, res){

    req.send("ok")

  });

  //API
  app.post('/_api/hypermarks', api.postHypermark);
  app.post('/_api/hypermarksChrome', api.postHypermarkChrome);
  app.post('/_api/hypermarksRemove', api.removeHypermark);

  app.get('/_api/hypermarks', api.getTimeline);
  app.get('/_api/search', api.searchHypermarks);
  app.post('/_api/hypermarks/clone', api.addToBlock);




  app.get('/_api/blocks/:block', api.getPublicBlock);
  app.get('/_api/blocks/_p/:block', api.getPrivateBlock);
  app.post('/_api/blocks', api.addToBlock);

  app.get('/_api/users/favorites', api.getFavoriteBlocks);
  app.post('/_api/users/favorites', api.touchFavoriteBlock);

  app.get('/login', users.loginpage);
  app.get('/signup', users.signuppage);

  //app.post('/_api/treepost/', api.treePost);

  //AUTH
  app.post('/_auth/logout', users.logout);
  app.post('/_auth/browserid', passport.authenticate('persona'));
  app.get('/_auth/external-login', users.externalLogin);


  //RESOURCES
  //Caution! There could be any number of bookmarklets in the wild depending on this route!
  app.get('/_resources/bookmarklet.js', browserify('../app/frontend/bookmarklet/index.js', {transform: ['simple-jadeify']}));

  app.get('/_resources/site.js', browserify('../app/frontend/site/index.js', {transform: ['simple-jadeify']}));


  //PAGES
  app.get('/', pages.timeline);
  app.get('/_search', pages.search);
  app.get('/_my/:block', pages.privateBlock);
  app.get('/:block', pages.publicBlock);
};
