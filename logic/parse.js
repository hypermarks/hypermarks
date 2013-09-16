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
exports.urlSanitize = function (urlStr) {
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

  return urlTools.normalize(urlStr, options);
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
 * @param {String} sani_url
 * @param {Function} done
 * @api public
 */

exports.pageHarvest = function (sani_url, callback) {
  // This controls the process using named functions
  getPage(sani_url, function(error, result, urlStr) {
    if (error) {
      callback(error);
    } else {
      var page = scrapeElements(result); //Extract relevant strings
      var favi_urls = resolveURLs(urlStr, page.favi_urls); //Resolve favicon URLs with checked url
      page.url = urlStr;
      page.sani_url = sani_url; //Add sanitized URL
      delete page.favi_urls;

      findFavicon(favi_urls, urlStr, function(full_favi_url) {
        page.favi_url = full_favi_url;
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
  var urlStrs = [
    'http://' + sani_url
    , 'https://' + sani_url
  ];

  var result, urlStr;
  async.until(
    function() {
      return result;
    }, function(cb) {
      urlStr = urlStrs.shift();
      if (urlStr) {
        request(urlStr, function(error, response, body) {
          result = body;
          cb();
        });
      } else {
        callback(new Error('No site found at: ' + sani_url));
      }
    }, function() {
      callback(null, result, urlStr);
    }
  );
}



function scrapeElements(body) {
  var $ = cheerio.load(body)
    , page = {
      title: $('title').text(),
      content: $('p').text()
    };

  page.favi_urls = [
    $('link[rel="icon"]').attr('href')
    , $('link[rel="shortcut icon"]').attr('href')
    , '/favicon.ico'
  ];
  
  return page;
}


function findFavicon(favi_urls, urlStr, callback) {
  async.detect(
    favi_urls,
    function(favi_url, cb) {
      request(favi_url, function(error, response) {
        if (error || !(response.statusCode === 200)) {
          cb(false);
        } else {
          cb(true);
        }
      });
    },

    function(result) {
      if (result) {
        callback(result); //Calls back with working favicon url- TODO: Possible base64 encoding of favicon?
      } else {
        callback(false); //Calls back with false so that we can avoid showing a broken image later
      }
    }
  );
}