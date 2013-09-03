var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:1337/api/new', true); //TODO: dynamically substitute urls for dev, prod, etc.
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send("url="+window.location);
