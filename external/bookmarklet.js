var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:1337/api/new', true); //TODO: dynamically substitute urls for dev, prod, etc.
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send("url="+window.location);

!function() {
	var jsCode = document.createElement('script');
	jsCode.setAttribute('src', 'https://login.persona.org/include.js');
	document.body.appendChild(jsCode);
}();



navigator.id.get(function(assertion) {
	if (!assertion) {
		return;
	}
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "localhost:1337/auth/browserid", true);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.addEventListener("loadend", function(e) {
		window.location.reload();
	}, false);

	xhr.send(JSON.stringify({
		assertion: assertion
	}));
}, {
	backgroundColor: '#75557A',
	siteName: 'Hypermarks'
});