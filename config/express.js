
/*!
 * Module dependencies.
 */

var express = require('express');
var mongoStore = require('connect-mongo')(express);

/*!
 * Expose
 */

//CORS middleware
var allowCrossOrigin = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

module.exports = function (app, config, passport) {

  // views config
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade');


  //Servering static files
  app.use(express.static(config.root + '/public'));
  
  //CORS
  //app.use(allowCrossOrigin);

  // bodyParser should be above methodOverride
  app.use(express.bodyParser())
  app.use(express.methodOverride())

  // cookieParser should be above session
  app.use(express.cookieParser())
  app.use(express.session({
    secret: 'lolasaurus',
    store: new mongoStore({
      url: config.db,
      collection : 'sessions'
    })
  }))

  // Passport session
  app.use(passport.initialize())
  app.use(passport.session())

  // routes should be at the last
  app.use(app.router)

}
