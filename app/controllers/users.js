'use strict';

//This checks if the user is logged in.
//If so, the user is sent back where they came from
//If not, the user is served a page that simply makes a browserid request
exports.login = function (req, res) {
	console.log('users.login');

	if (req.user) {
		console.log('check if user');
		res.redirect('http://google.com');
	} else {
		res.render('login');
	}
};

exports.logout = function (req, res) {
	console.log('exports.logout');
	req.logout();
	res.send(200);
};