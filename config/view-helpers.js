'use strict';

var truncate = require('truncate');

/**
 * Helpers method
 *
 * @param {String} name
 * @return {Function}
 * @api public
 */

function helpers () {
  return function (req, res, next) {
    res.locals.req = req;
    res.locals.formatDate = formatDate;
    res.locals.formatDatetime = formatDatetime;
    res.locals.stripScript = stripScript;
    res.locals.truncate = truncate;

    next();
  };
}

module.exports = helpers;

/**
 * Format date helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

function formatDate (date) {
  var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'June', 'July', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec' ];

  return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
}

/**
 * Format date time helper
 *
 * @param {Date} date
 * @return {String}
 * @api private
 */

function formatDatetime (date) {
  var hour = date.getHours();
  var minutes = date.getMinutes() < 10
    ? '0' + date.getMinutes().toString()
    : date.getMinutes();

  return formatDate(date) + ' ' + hour + ':' + minutes;
}

/**
 * Strip script tags
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function stripScript (str) {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

/**
 * Truncate
 * @param {String} string
 * @param {Number} maxLength
 * @param {object} options 
 */

function truncate (string, maxLength, options) {
   return truncate(string, maxLength, options);
}

