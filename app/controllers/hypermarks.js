'use strict';

var newHypermark = require('./new-hypermark.js');

exports.newHypermark = function (req, res) {
	newHypermark(req.body.url, 'hello', req.user, function(err){
	  if (err) return res.end(err); //TODO: possibly do something better with this.
	  return res.end('success'); //TODO: Replace with something useful
	});
};