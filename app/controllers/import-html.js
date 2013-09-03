/*
Take an exported list of bookmarks from chrome and turn them into json
*/


var newHypermark = reqire('./new-hypermark');
var Parser = require('htmlparser2').WritableStream
var Cornet = require('cornet');
var $ = require('cheerio');


var cornet = new Cornet();


hyperdirect.request("http://github.com/fb55").pipe(new Parser(cornet));

cornet.select("h3", function(elem){
  console.log($(elem).text().trim());
});





// module.exports = function (body, callback) {
//   var $ = cheerio.load(body);
//   var bookmarks = [];

//   $('dt a').each(function() {
//     var bookmark = {}
//     , bookmark.url = $(this).attr('href')
//     , bookmark.add_date = $(this).attr('add_date')
    
//     bookmarks.push(bookmark);
//   });

//   async.each(
//     bookmarks
//     , newHypermark
//     , function(err) {
//       if (err) {
//         return callback(err);
//       } else {
//         return callback;
//       }
//     }
//   )
// }
