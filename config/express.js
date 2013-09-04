/*!
 * Module dependencies.
 */

var express = require('express');
var mongoStore = require('connect-mongo')(express);

/*!
 * Expose
 */

module.exports = function(app, config, passport) {

  // views config
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');
  app.use(require('stylus').middleware(__dirname + '/public'));

  //Serving static files
  app.use(express.static(config.root + '/public'));

  // bodyParser should be above methodOverride
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // cookieParser should be above session
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'lolasaurus',
    store: new mongoStore({
      url: config.db,
      collection: 'sessions'
    })
  }))

  // Passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // routes should be at the last
  app.use(app.router);

}