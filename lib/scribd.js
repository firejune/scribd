/*!
 * Scribd - Unofficial NodeJS library
 *
 * Copyright(c) 2012 Joon Kyoung, @firejune <to@firejune.com>
 * MIT Licensed
 */


var fs = require('fs')
  , qs = require('querystring')
  , crypto = require('crypto')
  , path = require('path')
  , mime = require('mime')
  , clog = require('clog')
  , request = require('request')
  , xml2js = require('xml2js');


/**
 * Scribd class
 */

 
/**
 * Upload a document from a file
 * @param string apikey: (required) API key.
 * @param string secret: (required) API secret.
 * @param string options: (optional) debug flag.
 * @return object Scribd instant.
 */
function Scribd(apikey, secret, options) {

  this.version = '0.1.5';

  this.options = objectExtend({
      debug: false
    , apikey: apikey
    , secret: secret
  }, options || arguments[0]);

	this.apikey = this.options.apikey;
	this.secret = this.options.secret;
	this.url = "http://api.scribd.com/api?api_key=" + this.options.apikey;  

	this.parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true});
};


/**
 * Docs Method
 */
 
/**
 * Upload a document from a file
 * @param string file: (required) relative path to file
 * @param string doc_type: (optional) PDF, DOC, TXT, PPT, etc.
 * @param string access: (optional) public or private. Default is Public.
 * @param int rev_id: (optional) id of file to modify
 * @return array containing doc_id, access_key, and secret_password if nessesary.
 */
Scribd.prototype.upload = function(callback, file, docType, access, revId) {
	var method = "docs.upload"
	  , params = objectExtend({
		    file: file
	    , doc_type: docType || null
	    , access: access || null
	    , rev_id: revId || null
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	postRequest.bind(this)(callback, method, params);
};

/**
 * Upload a document from a Url
 * @param string url: (required) absolute URL of file 
 * @param string doc_type: (optional) PDF, DOC, TXT, PPT, etc.
 * @param string access: (optional) public or private. Default is Public.
 * @return array containing doc_id, access_key, and secret_password if nessesary.
 */
Scribd.prototype.uploadFromUrl = function(callback, url, docType, access, revId) {
	var method = "docs.uploadFromUrl"
	  , params = objectExtend({
  		  url: url
	    , doc_type: docType || null
	    , access: access || null
	    , rev_id: revId || null
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(callback, method, params);
};

/**
 * Get a list of the current users files
 * @return array containing doc_id, title, description, access_key, and conversion_status for all documents
 */
Scribd.prototype.getList = function(callback) {
	var method = "docs.getList";

	return postRequest.bind(this)(function(err, res) {
	  callback && callback(err, res.resultset || res);
	}, method);
};

/**
 * Get the current conversion status of a document
 * @param int doc_id: (required) document id
 * @return string containing DISPLAYABLE", "DONE", "ERROR", or "PROCESSING" for the current document.
 */
Scribd.prototype.getConversionStatus = function(callback, docId) {
	var method = "docs.getConversionStatus"
	  , params = objectExtend({doc_id: docId}, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(function(err, res) {
	  callback && callback(err, res.conversion_status || res);
	}, method, params);
};

/**
 * Get settings of a document
 * @param int doc_id: (required) document id
 * @return array containing doc_id, title , description , access, tags, show_ads, license, access_key, secret_password
 */
Scribd.prototype.getSettings = function(callback, docId) {
	var method = "docs.getSettings"
	  , params = objectExtend({doc_id: docId}, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(callback, method, params);
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
Scribd.prototype.changeSettings = function(callback, docIds, title, description, access, license, showAds, tags) {
  var method = "docs.changeSettings"
    , params = objectExtend({
  		  doc_ids: docIds
	    , title: title || null
	    , description: description || null
	    , access: access || null
	    , license: license || null
	    , show_ads: showAds || null
	    , tags: tags || null
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(callback, method, params);
};

/**
 * Get download link of a document
 * @param int doc_id: (required) document id
 * @param string doc_type: (optional) PDF, DOC, TXT, PPT, etc.
 * @return string download_link
 */
Scribd.prototype.getDownloadUrl = function(callback, docId, docType) {
	var method = "docs.getDownloadUrl"
	  , params = objectExtend({
	      doc_id: docId
	    , doc_type: docType || "original"
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(function(err, res) {
	  callback && callback(err, res.download_link || res);
	}, method, params);
};

/**
 * Get statistics of the document
 * @param int doc_id: (required) document id
 * @return object stats
 */
Scribd.prototype.getStats = function(callback, docId) {
	var method = "docs.getStats"
	  , params = objectExtend({doc_id: docId}, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(callback, method, params);
};

/**
 * Delete a document
 * @param int doc_id: (required) document id
 * @return 1 on success;
 */
Scribd.prototype.delete = function(callback, docId) {
	var method = "docs.delete"
	  , params = objectExtend({doc_id: docId}, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(callback, method, params);
};

/**
 * Search the Scribd database
 * @param string query: (required) search query
 * @param int num_results: (optional) number of results to return (10 default, 1000 max)
 * @param int num_start: (optional) number to start from
 * @param string scope: (optional) scope of search, "all" or "user"
 * @return array of results, each of which contain doc_id, secret password, access_key, title, and description
 */
Scribd.prototype.search = function(callback, query, numResults, numStart, scope) {
	var method = "docs.search"
    , params = objectExtend({
  		  query: query
	    , num_results: numResults || null
	    , num_start: numStart || null
	    , scope: scope || null
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(function(err, res) {
	  callback && callback(err, res.result_set || res);
	}, method, params);
};

/**
 * Get list of categories or subcategories
 * @param int doc_id: (required) document id
 * @return array of results, each of which categories or subcategories
 */
Scribd.prototype.getCategories = function(callback, docId) {
	var method = "docs.getCategories"
	  , params = objectExtend({doc_id: docId}, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(function(err, res) {
  	callback && callback(err, res.result_set || res);
	}, method, params);
};

/**
 * Get list of featured documents
 * @param int limit: (optional) number of results to return (20 default, 1000 max)
 * @param int offset: (optional) number of start at (0 default, 1000 max)
 * @param string scope: (optional) scope of search, "new" or "hot"
 * @return array of results with featured documents.
 */
Scribd.prototype.featured = function(callback, limit, offset, scope) {
	var method = "docs.featured"
    , params = objectExtend({
  		  limit: limit || null
	    , offset: offset || null
	    , scope: scope || null
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(function(err, res) {
	  callback && callback(err, res.result_set || res);
	}, method, params);
};

/**
 * Get list of documents that meet filter criteria
 * @param int limit: (optional) number of results to return (20 default, 1000 max)
 * @param int offset: (optional) number of start at (1 default, 1000 max)
 * @param int category_id: (optional) a category ID to search documents in
 * @param string sort: (optional) sort order. set to "popular" of "views" of "newest"
 * @return array of results with documents that meet filter criteria.
 */

Scribd.prototype.browse = function(callback, limit, offset, categoryId, sort) {
	var method = "docs.browse"
    , params = objectExtend({
  		  limit: limit || null
	    , offset: offset || null
	    , category_id: categoryId || null
	    , sort: sort || null
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(function(err, res) {
  	callback && callback(err, res.result_set || res);
	}, method, params);
};

/**
 * Add document thumbnail file
 * @param string file: (required) relative path to file
 * @param int doc_id: (required) document id
 * @return null
 */
Scribd.prototype.uploadThumb = function(callback, file, docId) {
	var method = "docs.uploadThumb"
	  , params = objectExtend({
		    file: file
	    , doc_id: docId
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	postRequest.bind(this)(callback, method, params);
};


/**
 * Thumbnail method
 */

/**
 * Get thumbnai of a document
 * @param int doc_id: (required) document id
 * @param int whdth: (required) width of thumbnail image
 * @param int height: (optional) height of thumbnail image
 * @return string thumbnail_url
 */
Scribd.prototype.getThumbnail = function(callback, docId, width, height) {
	var method = "thumbnail.get"
    , params = objectExtend({
  		  doc_id: docId
	    , width: width
	    , height: height || width
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(function(err, res) {
	  callback && callback(err, res.thumbnail_url || res);
	}, method, params);
};


/**
 * User method
 */
 
/**
 * Login as a user
 * @param string username: (required) username of user to log in
 * @param string password: (required) password of user to log in
 * @return array containing session_key, name, username, and user_id of the user;
 */
Scribd.prototype.login = function(callback, username, password) {
	var method = "user.login"
    , params = objectExtend({
  		  username: username
	    , password: password
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(function(err, res) {
		if (!err) this.session_key = res['session_key'];
		callback && callback(err, res);
	}.bind(this), method, params);
};

/**
 * Sign up a new user
 * @param string username: (required) username of user to create
 * @param string password: (required) password of user to create
 * @param string email: (required) email address of user
 * @param string name: (optional) name of user
 * @return array containing session_key, name, username, and user_id of the user;
 */
Scribd.prototype.signup = function(callback, username, password, email, name) {
	var method = "user.signup"
    , params = objectExtend({
  		  username: username
	    , password: password
	    , email: email
	    , name: name || null
	  }, arguments[0]);

	callback = 'function' == typeof(arguments[1]) ? arguments[1] : callback;
	return postRequest.bind(this)(callback, method, params);
};


/**
 * Request helper
 */

function postRequest(callback, method, params) {
  if (this.options.debug) clog('Scribd-' + method, params);

  var options = {uri: this.url};
  params = objectExtend({method: method}, params);
	params['api_sig'] = generateSig({
  	  method: method
  	, session_key: this.session_key
  	, my_user_id: this.my_user_id
	}, this.secret);

  if (params.file) {
    if (!fs.existsSync(params.file)) {
      return callback && callback(new Error('File not found'));
    }

    options.multipart = [];
    options.headers = {'content-type': 'multipart/form-data'},

    Object.keys(params).forEach(function(key) {
      if (key == 'file') {
        options.multipart.push({
            'Content-Disposition': 'form-data; name="file"; filename="' + path.basename(params.file) + '"'
          , 'Content-Type': mime.lookup(params[key]) || 'application/octet-stream'
          , 'body': fs.readFileSync(params[key])
        });
      } else {
        options.multipart.push({
            'Content-Disposition': 'form-data; name="' + key + '"'
          , 'body': params[key]
        });
      }
  	});

  } else {
    options.body = qs.stringify(params);
  }

  return request.post(options, function(err, res, body) {
    if (err) return callback && callback(err, body);

    this.parser.parseString(body, function(err, data) {
      if (err) return callback && callback(new Error(body));

      if (data.rsp) {
        data = data.rsp;

        if (data.stat == 'fail') {
          err = data.stat;
          data = data.error;
        }
        delete data.stat;

        callback && callback(err, data);
      }
    });

  }.bind(this));
}


/**
 * Returns merged object
 */

function objectExtend(obj1, obj2) {
	'object' == typeof(obj2) && Object.keys(obj2).forEach(function(key) {
  	if (obj2[key]) obj1[underscore(key)] = obj2[key];
	});

	return obj1;
};


/**
 * Returns generated signature from parameters
 */

function generateSig(params, secret) {
	var str = '';

	// Note: make sure that the signature parameter is not already included in params.
	Object.keys(params).forEach(function(key) {
  	str += key + params[key];
	});

	str = secret + str;

	return crypto.createHash('md5').update(str).digest("hex");
}


/**
 * Returns converted camel cased string into a string delimited by underscores.
 */

function underscore(str) {
  return str.trim().replace(/([a-z\d])([A-Z]+)/g, '$1_$2').toLowerCase();
}


/**
 * Export intance of Scribd as the module
 */

module.exports = Scribd;