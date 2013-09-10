
'use strict';

module.exports = function (req, res) {
	if (req.user) {
		res.redirect(req.body.referrer);
	}
	res.render('login');
};