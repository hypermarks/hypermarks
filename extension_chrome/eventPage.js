/**
 * Handles requests sent by the content script.  Shows an infobar.
 */
//alert("stuff");

chrome.bookmarks.getTree(function(tree){
	var StringSend="";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://127.0.0.1:1337/_testpost", true);
	xhr.onreadystatechange = function(data) {
	 // alert("done");
	};
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	StringSend=JSON.stringify(tree);//+=postname("givenname", "jeff")
	xhr.send(StringSend);
});


chrome.bookmarks.onCreated.addListener(function(num, bm){


alert(bm.url)

alert("bookamrk");


});
