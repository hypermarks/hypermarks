/**
 * Merge user-supplied `options` object with defaults.
 * @param  {Object} options
 * @return {Object}
 */
exports.mergeOptions = function (defaults, options) {
  if (!options) {
    return defaults;
  }

  // if user specifies an `options` value, ensure it's an object
  if (typeof options !== 'object') {
    throw new Error('Options object must be an object');
  }

  var mergedOptions = {};

  // merge the user's `options` object with `defaults`
  Object
  .keys(defaults)
  .forEach(function (key) {
    mergedOptions[key] = options[key] || defaults[key];
  });

  return mergedOptions;
};