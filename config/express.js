'use strict';

/*!
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , helpers = require('./view-helpers.js')
  // , pjax = require('express-pjax')
;

/*!
 * Expose
 */

module.exports = function(app, config, passport) {

  // app.use(express.logger());

  // views config
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

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
  app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.header('Origin'));
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.post('/*', function(req, res, next){
    console.log(req.body);
    next();
  });

  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, 'Something broke!');
  });

  // routes should be at the last
  app.use(app.router);

};
