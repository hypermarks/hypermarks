
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var browserify = require('browserify-middleware');
var passportOptions = {
  failureFlash: 'Invalid email or password.',
  failureRedirect: '/login'
}

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

  app.post('/auth/browserid',
    passport.authenticate('persona', {
      failureRedirect: '/login'
    }),
    function (req, res) {
      res.redirect('/');
    }
  );

}
