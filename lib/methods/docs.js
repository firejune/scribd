/*!
 * Scribd - Docs Methods
 *
 * Copyright(c) 2012 Joon Kyoung, @firejune <to@firejune.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

var utils = require('../utils');

/**
 * Upload a document from a file
 * @param string file: (required) relative path to file
 * @param string doc_type: (optional) PDF, DOC, TXT, PPT, etc.
 * @param string access: (optional) public or private. Default is Public.
 * @param integer rev_id: (optional) id of file to modify
 * @return array containing doc_id, access_key, and secret_password if nessesary.
 */
exports.upload = function(options, file, docType, access, revId) {
  return {
    params: utils.extend({
        file: file
      , doc_type: docType || null
      , access: access || null
      , rev_id: revId || null
    }, options)
  };
};

/**
 * Upload a document from a Url
 * @param string url: (required) absolute URL of file 
 * @param string doc_type: (optional) PDF, DOC, TXT, PPT, etc.
 * @param string access: (optional) public or private. Default is Public.
 * @return array containing doc_id, access_key, and secret_password if nessesary.
 */
exports.uploadFromUrl = function(options, url, docType, access, revId) {
  return {
    params: utils.extend({
        url: url
      , doc_type: docType || null
      , access: access || null
      , rev_id: revId || null
    }, options)
  };
};

/**
 * Get a list of the current users files
 * @return array containing doc_id, title, description, access_key, and conversion_status for all documents
 */
exports.getList = function() {
  return {
    returns: 'resultset'
  };
};

/**
 * Get the current conversion status of a document
 * @param integer doc_id: (required) document id
 * @return string containing DISPLAYABLE", "DONE", "ERROR", or "PROCESSING" for the current document.
 */
exports.getConversionStatus = function(options, docId) {
  return {
    params: utils.extend({doc_id: docId}, options),
    returns: 'conversion_status'
  };
};

/**
 * Get settings of a document
 * @param integer doc_id: (required) document id
 * @return array containing doc_id, title , description , access, tags, show_ads, license, access_key, secret_password
 */
exports.getSettings = function(options, docId) {
  return {
    params: utils.extend({doc_id: docId}, options)
  };
};

/**
 * Change settings of a document
 * @param array doc_ids: (required) document id
 * @param string title: (optional) title of document
 * @param string description: (optional) description of document
 * @param string access: (optional) private, or public
 * @param string license: (optional) "by", "by-nc", "by-nc-nd", "by-nc-sa", "by-nd", "by-sa", "c" or "pd"
 * @param string access: (optional) private, or public
 * @param array show_ads: (optional) default, true, or false
 * @param array tags: (optional) list of tags
 * @return string containing DISPLAYABLE", "DONE", "ERROR", or "PROCESSING" for the current document.
 */
exports.changeSettings = function(options, docIds, title, description, access, license, showAds, tags) {
  return {
    params: utils.extend({
        doc_ids: docIds
      , title: title || null
      , description: description || null
      , access: access || null
      , license: license || null
      , show_ads: showAds || null
      , tags: tags || null
    }, options)
  };
};

/**
 * Get download link of a document
 * @param integer doc_id: (required) document id
 * @param string doc_type: (optional) PDF, DOC, TXT, PPT, etc.
 * @return string download_link
 */
exports.getDownloadUrl = function(options, docId, docType) {
  return {
    params: utils.extend({
        doc_id: docId
      , doc_type: docType || "original"
    }, options),
    returns: 'download_link'
  };
};

/**
 * Get statistics of the document
 * @param integer doc_id: (required) document id
 * @return object stats
 */
exports.getStats = function(options, docId) {
  return {
    params: utils.extend({doc_id: docId}, options)
  };
};

/**
 * Delete a document
 * @param integer doc_id: (required) document id
 * @return 1 on success;
 */
exports.delete = function(options, docId) {
  return {
    params: utils.extend({doc_id: docId}, options)
  };
};

/**
 * Search the Scribd database
 * @param string query: (required) search query
 * @param integer num_results: (optional) number of results to return (10 default, 1000 max)
 * @param integer num_start: (optional) number to start from
 * @param string scope: (optional) scope of search, "all" or "user"
 * @return array of results, each of which contain doc_id, secret password, access_key, title, and description
 */
exports.search = function(options, query, numResults, numStart, scope) {
  return {
    params: utils.extend({
        query: query
      , num_results: numResults || null
      , num_start: numStart || null
      , scope: scope || null
    }, options),
    returns: 'result_set'
  };
};

/**
 * Get list of categories or subcategories
 * @param integer category_id: (optional) category id
 * @param boolean with_subcategories: (optional) include subcategories in results
 * @return array of results, each of which categories or subcategories
 */
exports.getCategories = function(options, categoryId, withSubcategories) {
  return {
    params: utils.extend({
        category_id: categoryId
      , with_subcategories: withSubcategories
    }, options),
    returns: 'result_set'
  };
};

/**
 * Get list of featured documents
 * @param integer limit: (optional) number of results to return (20 default, 1000 max)
 * @param integer offset: (optional) number of start at (0 default, 1000 max)
 * @param string scope: (optional) scope of search, "new" or "hot"
 * @return array of results with featured documents.
 */
exports.featured = function(options, limit, offset, scope) {
  return {
    params: utils.extend({
        limit: limit || null
      , offset: offset || null
      , scope: scope || null
    }, options),
    returns: 'result_set'
  };
};

/**
 * Get list of documents that meet filter criteria
 * @param integer limit: (optional) number of results to return (20 default, 1000 max)
 * @param integer offset: (optional) number of start at (1 default, 1000 max)
 * @param integer category_id: (optional) a category ID to search documents in
 * @param string sort: (optional) sort order. set to "popular" of "views" of "newest"
 * @return array of results with documents that meet filter criteria.
 */

exports.browse = function(options, limit, offset, categoryId, sort) {
  return {
    params: utils.extend({
        limit: limit || null
      , offset: offset || null
      , category_id: categoryId || null
      , sort: sort || null
    }, options),
    returns: 'result_set'
  };
};

/**
 * Add document thumbnail file
 * @param string file: (required) relative path to file
 * @param integer doc_id: (required) document id
 * @return null
 */
exports.uploadThumb = function(options, file, docId) {
  return {
    params: utils.extend({
        file: file
      , doc_id: docId
    }, options)
  };
};