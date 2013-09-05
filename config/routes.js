
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var browserify = require('browserify-middleware');
var multiparty = require('multiparty');
var auth = require('./middleware/auth');


// controllers
var home = require('../app/controllers/home.js')
var newHome = require('../app/controllers/new-home.js') //This is because I don't want to disturb the home.js controller right now.
var newHypermark = require('../app/controllers/new-hypermark');



/**
 * Expose
 */

module.exports = function (app, passport) {

  //Home
  app.get('/', auth.requiresLogin, newHome)

  //Browserify bookmarklet code
  app.get('/permanent/bookmarklet.js', browserify('../external/bookmarklet.js'));

  //Submit new hypermark
  app.post('/api/new', auth.requiresLogin, function(req, res) {
    newHypermark(req.body.url, 'hello', req.user, function(err){
      if (err) return res.end(err); //TODO: possibly do something better with this.
      return res.end('success') //TODO: Replace with something useful
    });
  });


  // Auth Routes
  // TODO: do something better with this
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
