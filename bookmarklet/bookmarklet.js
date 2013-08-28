var xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:3000/api', true);
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.onload = function () {
    // do something to response
    console.log(this.responseText);
};
xhr.send('user=person&pwd=password&organization=place&requiredkey=key');
