'use strict';

var createHypermark = require('./create-hypermark.js')
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
;

exports.timeline = function (req, res) {

  res.end('timeline')
  // res.render('timeline', {
  //   user: req.user
  //   , results: results
  // });
};