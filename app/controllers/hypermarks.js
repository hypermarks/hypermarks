'use strict';

var createHypermark = require('./create-hypermark.js');

exports.postHypermark = function (req, res) {
  if (!req.user) {
    res.end('401');
  } else {
    var opts = {
      url: req.body.url
      , add_date: null //Model will set current date
      , user: req.user
    };
    createHypermark(opts, function(err){
      if (err) {
        res.end('500');
      } else {
        res.end('200');
      }
    });
  }
};