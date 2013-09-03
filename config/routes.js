
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var browserify = require('browserify-middleware');
var multiparty = require('multiparty');
var newHypermark = require('../app/controllers/new-hypermark');

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
  app.get('/permanent/bookmarklet.js', browserify('../external/bookmarklet.js'));

  // app.get('/permanent/extension.js', browserify('../external/extension.js')); //On hold for now

  app.post('/api/new', ensureAuthenticated, function(req, res) {
    newHypermark(req.body.url, 'hello', req.user, function(err){
      if (err) return res.end(err); //TODO: possibly do something better with this.
      return res.end('success') //TODO: Replace with something useful
    });
  });

  app.post('/api/posttest', function(req, res) {
    console.log(req.body.url);
  });

  app.get('/login', function (req, res) {
    res.render('login', {
      user: req.user
      , bookmarklet: "javascript:!function(){var jsCode=document.createElement('script');jsCode.setAttribute('src','http://localhost:1337/permanent/bookmarklet.js');document.body.appendChild(jsCode);}();" //TODO: some sort of a better solution for bookmarklet loader inclusion

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
