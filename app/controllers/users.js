'use strict';


var mongoose = require('mongoose')


//This checks if the user is logged in.
//If so, the user is sent back where they came from
//If not, the user is served a page that simply makes a browserid request
exports.login = function (req, res) {

	var url=req.param("redirecturl");

	console.log(url);

	console.log(new Date().getTime());


	console.log(req.user);

	if (req.user) {

		//At this point we have verified they have logged in.
		//Here is where we put the username


		res.redirect(url);
	} else {
		///here is where you ahve to pass in the parameter for the page to redirect to.
		res.render('login',{
			url:url
		});
	}
};

exports.logout = function (req, res) {
	console.log('exports.logout');
	req.logout();
	res.send(200);
};