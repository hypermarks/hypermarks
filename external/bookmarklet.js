'use strict';

!function() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:1337/auth/login', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	// xhr.send('referer='+window.location);
}();
