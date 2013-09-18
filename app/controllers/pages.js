'use strict';

var createHypermark = require('./create-hypermark.js')
  , mongoose = require('mongoose')
  , Bookmark = mongoose.model('Bookmark')
  , Address = mongoose.model('Address')
;

exports.home = function (req, res) {
  console.log('exports.home');
  Bookmark.find({_user: req.user})
  .populate('_address')
  .exec(function (err, bookmarks) {
    if (err) return console.log(new Error(err));
    
    console.log('display bookmarks', bookmarks);
    res.end(JSON.stringify(bookmarks));
  });
};