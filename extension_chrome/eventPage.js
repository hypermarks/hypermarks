/**
 * Handles requests sent by the content script.  Shows an infobar.
 */
//alert("stuff");

chrome.bookmarks.getTree(function(tree){

  alert(tree);

  console.log(tree);

});

 // var bookmarkTreeNodes = chrome.bookmarks.getTree(
 //    function(bookmarkTreeNodes) {
 //      alert("tree");
 //      //$('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
 //    });


chrome.bookmarks.onCreated.addListener(function(){

alert("bookamrk");


});
