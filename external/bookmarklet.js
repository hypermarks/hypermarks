'use strict';

!function() {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://localhost:1337/auth/login', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.send('referer='+window.location);
}();



// navigator.id.get(function(assertion) {
// 	if (!assertion) {
// 		return;
// 	}
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('POST', 'localhost:1337/auth/browserid', true);
// 	xhr.setRequestHeader('Content-Type', 'application/json');

// 	xhr.addEventListener('loadend', function() {
// 		window.location.reload();
// 	}, false);

// 	xhr.send(JSON.stringify({
// 		assertion: assertion
// 	}));
// }, {
// 	backgroundColor: '#75557A',
// 	siteName: 'Hypermarks'
// });