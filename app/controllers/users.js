'use strict';

exports.externalLogin = function (req, res) {
  // This gets the redirect url from the query string
  var redirectUrl = req.param('redirectUrl');

  console.log('externalLogin from:', redirectUrl);

  res.render('external-login', {
    redirectUrl: redirectUrl
  });
};


exports.logout = function (req, res) {
  console.log('exports.logout');
  req.logout();
  res.send(200);
};