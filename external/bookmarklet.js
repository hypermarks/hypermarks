'use strict';

!function () {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://localhost:1337/api/bookmarks', true); //TODO: dynamically substitute urls for dev, prod, etc.
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	
	xhr.addEventListener('error', function(e) {
		console.log(xhr.status);
	}, false);
	
	xhr.send('url=' + window.location);
}();

// //Testing external login
// var redirectUrl = window.location;
// alert(redirectUrl);
// window.location.href = 'http://localhost:1337/auth/externalLogin?redirectUrl=' + redirectUrl;
