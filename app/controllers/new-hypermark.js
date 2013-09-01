var parse = require('./logic/parse.js');
var User = mongoose.model('User');
var Address = mongoose.model('Address');



module.exports = function(url, add_date, user, callback) {
	var saniUrl = parse.urlSanitize(url);
	parse.pageHarvest(saniUrl, function(err, page) { //Scrapes page
		if (err) {
			callback(err);
		} else {
			async.parallel([
				bookmarkCreate(url, add_date, user)
				, addressUpsert(page, user)
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
	}).save(function(err) {
		if (err) return cb(err);
		return cb(null);
	});
}


function addressUpsert(page, user, cb) {
	Address.findOneAndUpdate({
		saniUrl: page.saniUrl //Sanitizes URL to avoid multiples of the same page
	}, {
		$set: { //Creates or overwrite items with new scrape data
			url: page.url,
			favicon: page.favicon,
			body: page.body,
			title: page.title
		},
		$addToSet: { //Adds reference to the user for filtering later
			users: user._id
		}
	}, {
		upsert: true //Creates new document if one does not exist :-)
		, select: '_id' //Select only fields we need
	}, function(err) {
		if (err) return cb(err);
		return cb(null);
	})
});