module.exports = function(req, res) {
		var results = [
		{
			"favicon": "false"
			, "date_added": ""
			, "title": ""
			, "link": ""
		}
		, {
			"favicon": "false"
			, "date_added": ""
			, "title": ""
			, "link": ""
		}
		, {
			"favicon": "https://github.com/favicon.ico"
			, "date_added": ""
			, "title": ""
			, "link": ""
		}
		, {
			"favicon": "false"
			, "date_added": ""
			, "title": ""
			, "link": ""
		}
	];

	res.render('home', {
      results: results
    });
}