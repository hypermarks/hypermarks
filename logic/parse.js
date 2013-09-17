'use strict';

var request = require('request'),
  cheerio = require('cheerio'),
  async = require('async'),
  _ = require('lodash'),
  urlLib = require('url'),
  urlTools = require('url-tools');

/**
 * Sanitize raw url for our system.
 *
 * Examples:
 *
 *      parse.urlSanitize("https://www.website.com#canoe") // sani_url = "website.com
 *
 * @param {String} sani_url
 * @param {Function} done
 * @api public
 */

// TODO: Write tests for parse.urlSanitize
exports.urlSanitize = function(url_str) {
  var options = {
    lowercase: true,
    removeWWW: true,
    removeTrailingSlash: true,
    forceTrailingSlash: false,
    removeSearch: false,
    removeHash: true,
    removeHashbang: true,
    removeProtocol: true
  };

  return urlTools.normalize(url_str, options);
};


/**
 * Scrape all neccesary information from a page. Takes a sanitized url
 * (hostname + pathname) and returns a page object containing the information.
 *
 * Examples:
 *
 *    parse.pageHarvest("website.com", function(page) {
 *      doSomething(page);
 *    });
 *
 *    //page obj looks like this:
 *    page = {
 *      url: 
 *      , sani_url:
 *      , title:
 *      , content:
 *    }
 *
 * @param {String} sani_url
 * @param {Function} done
 * @api public
 */

exports.pageHarvest = function(sani_url, callback) {
  // This controls the process using named functions
  getPage(sani_url, function(error, result, url_str) {
    if (error) {
      callback(error);
    } else {
      var page = scrapeElements(result); //Extract relevant strings
      page.url = url_str; //This is the url that is accesible to everyone (we have tried it)

      var favicon_urls = resolveURLs(page.url, page.favicon_links); //Resolve favicon URLs with checked url
      delete page.favicon_links;
      

      findFavicon(favicon_urls, page.url, function(full_favicon_url) { //Figures out which favicon url is correct
        page.favicon_url = full_favicon_url;
        callback(null, page); //CALLBACK
      });
    }
  });
};


function resolveURLs(base, links) {
  links = _.compact(links);
  return _.map(links, function(link) {
    if (typeof link === 'string') {
      return urlLib.resolve(base, link);
    } else {
      return false;
    }
  });
}


function getPage(sani_url, callback) {
  var url_strs = [
    'http://' + sani_url
    , 'https://' + sani_url
  ];

  var result, url_str;
  async.until(
    function() {
      return result;
    }, function(cb) {
      url_str = url_strs.shift();
      if (url_str) {
        request(url_str, function(error, response, body) {
          result = body;
          cb();
        });
      } else {
        callback(new Error('No site found at: ' + sani_url));
      }
    }, function() {
      callback(null, result, url_str);
    }
  );
}



function scrapeElements(body) {
  var $ = cheerio.load(body);

  var raw_content = $('p').text()
    , content = raw_content.replace(/\s{2,}/g, ' ');

  //This is a list of elements to be scraped out of the page.
  var page = {
      title: $('title').text()
      , content: content
    };

  //This is a list of possible favicon links
  page.favicon_links = [
    $('link[rel="icon"]').attr('href')
    , $('link[rel="shortcut icon"]').attr('href')
    , '/favicon.ico'
  ];

  return page;
}


function findFavicon(favicon_urls, url_str, callback) {
  async.detect(
    favicon_urls,
    function(favicon_url, cb) {
      request(favicon_url, function(error, response) {
        if (error || !(response.statusCode === 200)) {
          cb(false);
        } else {
          cb(true);
        }
      });
    },

    function(result) {
      if (result) {
        callback(result); //Calls back with working favicon url
      } else {
        callback(false); //Calls back with false so that we can avoid showing a broken image later
      }
    }
  );
}