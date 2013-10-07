'use strict';

var env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env];

exports.externalLogin = function (req, res) {
  // This gets the redirect url from the query string
  var redirectUrl = req.param('redirectUrl');


  res.render('external-login', {
    redirectUrl: redirectUrl
    , config : config.hostDomain
  });
};


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
  console.log('exports.logout');
  req.logout();
  res.send(200);
};