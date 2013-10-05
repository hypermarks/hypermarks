chrome.cookies.getAll({domain:"localhost"}, function(cookies){
	///set the cookie for the user'ssession
	chrome.cookies.set({ url: "http://127.0.0.1:1337/_api/treepost", name: "connect.sid", value: cookies[3].value });

});



chrome.bookmarks.onCreated.addListener(function(num, bm){
	sendXHR(JSON.stringify(bm));
});


chrome.bookmarks.getTree(function(tree){
	sendXHR(JSON.stringify(tree));
});


function sendXHR(content){

	var StringSend="";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://127.0.0.1:1337/_api/treepost", true);
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	xhr.setRequestHeader('X-Alt-Referer', 'http://www.google.com');
	xhr.onreadystatechange = function(data) {
		// alert("done");
	};
	//xhr.withCredentials = true;
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send(content);


}



