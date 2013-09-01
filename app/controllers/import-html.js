/*
Take an exported list of bookmarks from chrome and turn them into json
*/

var cheerio = require('cheerio');
var newHypermark = reqire('./new-hypermark')


module.exports = function (body, callback) {
  var $ = cheerio.load(body);
  var bookmarks = [];

  $('dt a').each(function() {
    var bookmark = {}
    , bookmark.url = $(this).attr('href')
    , bookmark.add_date = $(this).attr('add_date')
    
    bookmarks.push(bookmark);
  });

  async.each(
    bookmarks
    , newHypermark
    , function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback;
      }
    }
  )
}
