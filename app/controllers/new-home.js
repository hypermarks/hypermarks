module.exports = function(req, res) {
		var results = [
		{
			'favicon': 'false'
			, 'date_added': ''
			, 'title': 'Da Mystery of Chessboxing'
			, 'url': '#'
			, 'sani_url': 'wutang.com/discography/da-mystery-of-chessboxin' 
		}
		, {
			'favicon': 'http://roots.cx/favicon.ico'
			, 'date_added': ''
			, 'title': 'Weird Times in the Gold Mines'
			, 'url': '#'
			, 'sani_url': 'doors.com/albums/wierd-times.html'
		}
		, {
			'favicon': 'https://github.com/favicon.ico'
			, 'date_added': ''
			, 'title': 'Github - Shell script linter'
			, 'url': '#'
			, 'sani_url': 'github.com/staylor/UI-Toolbox'
		}
		, {
			'favicon': 'false'
			, 'date_added': ''
			, 'title': 'Ufo Research'
			, 'url': '#'
			, 'sani_url': 'roswellufomuseum.com/research.html'
		}
	];

	res.render('home', {
      results: results
    });
}