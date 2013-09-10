'use strict';


//Testing external login
var redirectUrl = window.location;
alert(redirectUrl);
window.location.href = 'http://localhost:1337/auth/externalLogin?redirectUrl=' + redirectUrl;