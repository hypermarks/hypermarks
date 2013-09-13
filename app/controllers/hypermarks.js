'use strict';

var createHypermark = require('./create-hypermark.js');

exports.postHypermark = function (req, res) {
  console.log('postHypermark user', req.user)
  console.log('postHypermark body', req.body)
  if (!req.user) {
    console.log('no user')
    res.end('401');
  }
  var opts = {
    url: req.body.url
    , add_date: null //Model will set current date
    , user: req.user
  };
  createHypermark(opts, function(err){
    if (err) {
      console.log(err)
      res.end('500');
    } else {
      console.log('success')
      res.end('200');
    }
  });
};