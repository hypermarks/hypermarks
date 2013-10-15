'use strict';

var env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')()
  , mongoose = require('mongoose')
  , User = mongoose.model('User');

exports.externalLogin = function (req, res) {
  // This gets the redirect url from the query string
  var redirectUrl = req.param('redirectUrl');

  res.render('external-login', {
    redirectUrl: redirectUrl
    , config : config.url
  });
};

//
var login = function (req, res) {
  if (req.session.returnTo) {
    res.redirect(req.session.returnTo)
    delete req.session.returnTo
    return
  }
  res.redirect('/')
}
exports.session = login
//

exports.loginpage = function (req, res) {
  res.render('login_page', {
  });
};

exports.signuppage = function (req, res) {
  res.render('signup_page', {
  });
};


exports.signup = function (req, res) {
	///this is where traditional signup goes
};

exports.logout = function (req, res) {
  req.logout();
  res.writeHead(200, { 'Content-Type':'application/json'});
  res.end();
};

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    });
  
  };

/**
 * Create user
 */

exports.create = function (req, res) {
  console.log(req.body);
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', {
        errors: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      })
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

