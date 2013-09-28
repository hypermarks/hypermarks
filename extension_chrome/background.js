/**
 * Handles requests sent by the content script.  Shows an infobar.
 */
//alert("stuff");

var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      alert("tree");
      //$('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });

chrome.bookmarks.onCreated.addListener(function(event){

  alert("bookamrk");


});