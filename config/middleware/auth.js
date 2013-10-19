'use strict';

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/_auth/login');
  }
  next();
};