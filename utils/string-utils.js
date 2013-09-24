'use strict';

// Replaces all the characters in the regex with a single space and trims
exports.sanitize = function(string) {
  return string.replace(/[\s+_-]/g, ' ').replace(/\s{2,}/g, ' ').toLowerCase().trim();
};