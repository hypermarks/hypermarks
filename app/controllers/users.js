'use strict';


// var mongoose = require('mongoose');


//This checks if the user is logged in.
//If so, the user is sent back where they came from
//If not, the user is served a page that makes a 
//browserid request, with the redirect url templated in
exports.externalLogin = function (req, res) {

  // This gets the redirect url from the query string
  var redirectUrl = req.param('redirectUrl');

  console.log('redirectUrl', redirectUrl);

  if (req.user) {
    res.redirect(redirectUrl || '/'); // This guards against an undefined redirectUrl
  } else {
    // Pass the redirectUrl to the template
    res.render('login',{
      url: redirectUrl
    });
  }
};

exports.browserid = function (req, res) {
  // This gets the redirect url from the query string
  var redirectUrl = req.param('redirectUrl');

  console.log('users.browserid', redirectUrl);

  res.redirect(redirectUrl || '/'); // This guards against an undefined redirectUrl
};


exports.logout = function (req, res) {
  console.log('exports.logout');
  req.logout();
  res.send(200);
};