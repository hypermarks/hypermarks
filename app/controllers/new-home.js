module.exports = function(req, res) {
		var results = [
		{
			"favicon": "false"
			, "date_added": ""
			, "title": "Da Mystery of Chessboxing"
			, "link": "#"
		}
		, {
			"favicon": "http://roots.cx/favicon.ico"
			, "date_added": ""
			, "title": "Weird Times in the Gold Mines"
			, "link": "#"
		}
		, {
			"favicon": "https://github.com/favicon.ico"
			, "date_added": ""
			, "title": "Github - Shell script linter"
			, "link": "#"
		}
		, {
			"favicon": "false"
			, "date_added": ""
			, "title": "Ufo Research"
			, "link": "#"
		}
	];

	res.render('home', {
      results: results
    });
}