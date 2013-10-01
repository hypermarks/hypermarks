/**
 * Handles requests sent by the content script.  Shows an infobar.
 */
//alert("stuff");

var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
	    alert("tree");
		var StringSend="";
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "https://localhost/_testpost", true);
		xhr.onreadystatechange = function(data) {
		  alert("done")
		};
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		StringSend+=t.postname("givenname", "jeff")
		xhr.send(StringSend);

      //$('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });

chrome.bookmarks.onCreated.addListener(function(event){

  alert("bookamrk");


});


