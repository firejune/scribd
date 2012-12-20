/*!
 * Scribd - Thumbnail method
 *
 * Copyright(c) 2012 Joon Kyoung, @firejune <to@firejune.com>
 * MIT Licensed
 */


/**
 * Module dependencies
 */

var utils = require('../utils');


/**
 * Get thumbnai of a document
 * @param integer doc_id: (required) document id
 * @param integer whdth: (required) width of thumbnail image
 * @param integer height: (optional) height of thumbnail image
 * @return string thumbnail_url
 */
exports.get = function(options, docId, width, height) {
  return {
    params: utils.extend({
        doc_id: docId
      , width: width
      , height: height || width
    }, options),
    returns: 'thumbnail_url'
  };
};