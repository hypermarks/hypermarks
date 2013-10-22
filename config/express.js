'use strict';

/*!
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , helpers = require('./view-helpers.js')
  , Mixpanel = require('mixpanel');

// create an instance of the mixpanel client
var mixpanel = Mixpanel.init('615bcde1130ab68baaf17ccd1a1846a2');

/*!
 * Expose
 */

module.exports = function(app, config, passport) {
  
  // views config
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');
  app.set('view options', {pretty: true});

  //Stylsheet render
  app.use(require('stylus').middleware(config.root + '/public'));

  //Serving static files
  app.use(express.static(config.root + '/public'));

  // bodyParser should be above methodOverride
  app.use(express.bodyParser());
  app.use(express.methodOverride());


  // cookieParser should be above session
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'lolasaurus'
    , store: new mongoStore({
      url: config.db,
      collection: 'sessions'
    })
  }));

  // Passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // should be declared after session and flash
  app.use(helpers());

  //CORS 
  //TODO: Refactor into middleware
  //TODO: Secure!
 // simple logger
  app.use(function(req, res, next){
    mixpanel.track(req.url, {
        user: req.user.username,
    });
    next();
  });

  app.all('/*', function(req, res, next) {
    var header;
    if (req.header('Origin')) header=req.header('Origin'); else header="*";
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.post('/*', function(req, res, next){
    next();
  });


  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, 'Something broke!');
  });

  // routes should be at the last
  app.use(app.router);

};
