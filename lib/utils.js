/*!
 * Scribd - Utils
 *
 * Copyright(c) 2012 Joon Kyoung, @firejune <to@firejune.com>
 * MIT Licensed
 */


/**
 * Returns merged object
 */
exports.extend = function(obj1, obj2) {
  'object' == typeof(obj2) && Object.keys(obj2).forEach(function(key) {
    if (obj2[key]) obj1[exports.underscore(key)] = obj2[key];
  });

  return obj1;
};


/**
 * Returns converted camel cased string into a string delimited by underscores.
 */

exports.underscore = function(str) {
  return str.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').toLowerCase();
};