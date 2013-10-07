chrome.cookies.getAll({domain:"localhost"}, function(cookies){
	///set the cookie for the user'ssession
	chrome.cookies.set({ url: "http://127.0.0.1:1337/", name: "connect.sid", value: cookies[3].value });

});



chrome.bookmarks.onCreated.addListener(function(num, bm){
	//alert(JSON.stringify(bm));
	sendXHR(bm,"http://127.0.0.1:1337/_api/hypermarksChrome");
});

chrome.bookmarks.onMoved.addListener(function(num, bm){
	//{"index":24,"oldIndex":1,"oldParentId":"1657","parentId":"1658"}
	alert(JSON.stringify(bm));
	sendXHR(bm,"http://127.0.0.1:1337/_api/hypermarksChromeMove");
});

chrome.bookmarks.onRemoved.addListener(function(num, bm){
	sendXHR(bm,"http://127.0.0.1:1337/_api/hypermarksRemove");
});



chrome.bookmarks.getTree(function(tree){
	//sendXHR(JSON.stringify(tree),"http://127.0.0.1:1337/_api/treepost");
});





function sendXHR(content, endpoint){
	var StringSend="";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", endpoint, true);
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	xhr.setRequestHeader('X-Alt-Referer', 'http://www.google.com');
	xhr.onreadystatechange = function(data) {
		// alert("done");
	};
	//xhr.withCredentials = true;
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send( postformater(content) );
}

function postformater(obj) {
	var string="";
	for (var item in obj)
		string+=String(item)+"="+String(obj[item])+"&";
	return string;
}