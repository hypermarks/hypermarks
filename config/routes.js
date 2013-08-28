
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

  app.get('/', home.index)

  // browserify bookmarklet code
  app.get('/js/bookmarklet.js', browserify('../bookmarklet/bookmarklet.js'));

  app.get('/login', function (req, res) {
    res.render('login', {
      user: req.user
    });
  });

  app.post('/auth/logout', function(req, res) {
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
