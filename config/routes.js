
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var browserify = require('browserify-middleware');

// controllers
var home = require('../app/controllers/home.js')


// authentication utility
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

/**
 * Expose
 */

module.exports = function (app, passport) {

  app.get('/', function(req, res){
    res.end('hello');
  })


  // browserify bookmarklet code
  app.get('/bookmarklet.js', browserify('../external/bookmarklet.js'));

  app.post('/import', function (req, res) {
    console.log(req.files);
  })

  app.get('/login', function (req, res) {
    res.render('login', {
      user: req.user
    });
  });

  app.post('/auth/logout', function (req, res) {
    req.logout();
    res.send('ok');
  });

  app.post('/auth/browserid',
    passport.authenticate('persona', {
      failureRedirect: '/'
    }),
    function (req, res) {
      console.log('auth attempt');
      res.redirect('/');
    }
  );

}
