/**
 * Handles requests sent by the content script.  Shows an infobar.
 */
//alert("stuff");

chrome.bookmarks.getTree(function(tree){

//open to window
 //chrome.windows.create({url: "http://localhost:1337/_auth/external-login"});




});


chrome.bookmarks.onCreated.addListener(function(num, bm){

//open to window
 //chrome.windows.create({url: "http://localhost:1337/_auth/external-login"});


	var script2 = document.createElement('script');
	script2.src='http://localhost:1337/script/hm_inject.js';
	script2.type='text/javascript';
	document.getElementsByTagName('Body').item(0).appendChild(script2);







});
