'use strict';

var newHypermark = require('./new-hypermark.js');

exports.newHypermark = function (req, res) {
	var opts = {
		url: req.body.url
		, add_date: null //Model will set current date
		, user: req.user
	};
	newHypermark(opts, function(err){
	  if (err) return res.end(err); //TODO: possibly do something better with this.
	  return res.end('success'); //TODO: Replace with something useful
	});
};