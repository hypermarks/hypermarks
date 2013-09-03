var parse = require('../../logic/parse.js');
var mongoose = require('mongoose');
var async = require('async');
var User = mongoose.model('User');
var Address = mongoose.model('Address');

/**
 * Scrape page info and save to db's
 * 
 * This module takes info about a page from wherever, and calls parse.pageHarvest to get info about
 * the page. It then checks the address index and inserts a new record if the address does not yet
 * exist, or updates an existing record. It then inserts a record in the user's 'bookmarks' sub index,
 * containing the url, the add_date and the _id of the address record.
 */

module.exports = function(url, add_date, user, callback) { //TODO: possibly set some sort of default date
	var saniUrl = parse.urlSanitize(url);
	parse.pageHarvest(saniUrl, function(err, page) { //Scrapes page
		if (err) {
			callback(err);
		} else {
			async.parallel([ //TODO: Replace with waterfall and populate bookmark with correct _id from url
				function (cb) {
					bookmarkCreate(url, add_date, user, function(err) {
						if (err) return cb(err);
						cb(null);
						console.log('bmc')
					})
				}
				, function (cb) {
					addressUpsert(page, user, function(err) {
						console.log('adu-call', page.saniUrl)
						if (err) {
							console.log(err)
							cb(err);
						} else {
							cb(null);
						}
					})
				}
			], function(err) {
				if (err) return callback(err)
				return callback(null);
			});
		}
	});
}


function bookmarkCreate(url, add_date, user, cb) {
	user.bookmarks.push({
		url: url,
		add_date: add_date
	});
	user.save(function(err) {
		if (err) return cb(err);
		return cb(null);
	});
}


function addressUpsert(page, user, cb) {
	// var saniUrl = page.saniUrl
	console.log('adu-func', page.saniUrl)
	Address.findOneAndUpdate({
		saniUrl: page.saniUrl //Sanitizes URL to avoid multiples of the same page
	}, {
		$set: { //Creates or overwrite items with new scrape data
			url: page.url,
			favicon: page.favicon || 'false', //Guards against trying to write a boolean to the db
			body: page.body,
			title: page.title
		},
		$addToSet: { //Adds reference to the user for filtering later
			users: user._id
		}
	}, {
		upsert: true //Creates new document if one does not exist :-)
		, select: '_id' //Select only fields we need //TODO: put everything in right order and populate bookmark with this
	}, function(err) {
		if (err) return cb(err);
		return cb(null);
	})
}