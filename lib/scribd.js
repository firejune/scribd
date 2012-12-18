/*!
 * Scribd - Unofficial NodeJS library
 *
 * Copyright(c) 2012 Firejune <to@firejune.com>
 * MIT Licensed
 */


var crypto = require('crypto')
  , qs = require('querystring')
  , fs = require('fs')
  , path = require('path')
  , mime = require('mime')
  , request = require('request')
  , xml2json = require('xml2json').toJson;


/**
 * Scribd class
 */

function Scribd(apikey, secret) {

  this.version = '0.1.0';
	this.apikey = apikey;
	this.secret = secret;
	this.url = "http://api.scribd.com/api?api_key=" + apikey;  

};


/**
 * Scribd methods
 */

Scribd.prototype = {

  /**
   * Upload a document from a file
   * @param string file : relative path to file
   * @param string doc_type : PDF, DOC, TXT, PPT, etc.
   * @param string access : public or private. Default is Public.
   * @param int rev_id : id of file to modify
   * @return array containing doc_id, access_key, and secret_password if nessesary.
   */
  upload: function(callback, file, docType, access, revId) {
		var method = "docs.upload"
		  , params = {
  		    file: file
		    , doc_type: docType || null
		    , access: access || null
		    , rev_id: revId || null
		  };

		postRequest.bind(this)(callback, method, params);
	},

  /**
   * Upload a document from a Url
   * @param string url : absolute URL of file 
   * @param string doc_type : PDF, DOC, TXT, PPT, etc.
   * @param string access : public or private. Default is Public.
   * @return array containing doc_id, access_key, and secret_password if nessesary.
   */
  uploadFromUrl: function(callback, url, docType, access, revId) {
		var method = "docs.uploadFromUrl"
		  , params = {
    		  url: url
		    , doc_type: docType || null
		    , access: access || null
		    , rev_id: revId || null
		  };

		return postRequest.bind(this)(callback, method, params);
	},

  /**
   * Get a list of the current users files
   * @return array containing doc_id, title, description, access_key, and conversion_status for all documents
   */
  getList: function(callback) {
		var method = "docs.getList";

		return postRequest.bind(this)(function(err, res) {
		  callback(err, res.resultset || res);
		}, method);
	},

  /**
   * Get the current conversion status of a document
   * @param int doc_id : document id
   * @return string containing DISPLAYABLE", "DONE", "ERROR", or "PROCESSING" for the current document.
   */
  getConversionStatus: function(callback, docId) {
		var method = "docs.getConversionStatus"
		  , params = {doc_id: docId};

		return postRequest.bind(this)(function(err, res) {
		  callback(err, res.conversion_status || res);
		}, method, params);
	},

	/**
	* Get settings of a document
	* @return array containing doc_id, title , description , access, tags, show_ads, license, access_key, secret_password
	*/
  getSettings: function(callback, docId) {
		var method = "docs.getSettings"
		  , params = {doc_id: docId};

		return postRequest.bind(this)(callback, method, params);
	},

  /**
   * Change settings of a document
   * @param array doc_ids : document id
   * @param string title : title of document
   * @param string description : description of document
   * @param string access : private, or public
   * @param string license : "by", "by-nc", "by-nc-nd", "by-nc-sa", "by-nd", "by-sa", "c" or "pd"
   * @param string access : private, or public
   * @param array show_ads : default, true, or false
   * @param array tags : list of tags
   * @return string containing DISPLAYABLE", "DONE", "ERROR", or "PROCESSING" for the current document.
   */
  changeSettings: function(callback, docIds, title, description, access, license, showAds, tags) {
    var method = "docs.changeSettings"
      , params = {
    		  doc_ids: docIds
		    , title: title || null
		    , description: description || null
		    , access: access || null
		    , license: license || null
		    , show_ads: showAds || null
		    , tags: tags || null
		  };

		return postRequest.bind(this)(callback, method, params);
  },

  /**
   * Delete a document
   * @param int doc_id : document id
   * @return 1 on success;
   */
  remove: function(callback, docId) {
		var method = "docs.delete"
		  , params = {doc_id: docId};

		return postRequest.bind(this)(callback, method, params);
	},

  /**
   * Search the Scribd database
   * @param string query : search query
   * @param int num_results : number of results to return (10 default, 1000 max)
   * @param int num_start : number to start from
   * @param string scope : scope of search, "all" or "user"
   * @return array of results, each of which contain doc_id, secret password, access_key, title, and description
   */
  search: function(callback, query, numResults, numStart, scope) {
		var method = "docs.search"
      , params = {
    		  query: query
		    , num_results: numResults || null
		    , num_start: numStart || null
		    , scope: scope || null
		  };

		return postRequest.bind(this)(function(err, res) {
		  callback(err, res.result_set || res);
		}, method, params);
	},

  /**
   * Login as a user
   * @param string username : username of user to log in
   * @param string password : password of user to log in
   * @return array containing session_key, name, username, and user_id of the user;
   */
  login: function(callback, username, password) {
		var method = "user.login"
      , params = {
    		  username: username
		    , password: password
		  };

		return postRequest.bind(this)(function(err, res) {
  		if (!err) this.session_key = res['session_key'];
  		callback(err, res);
		}.bind(this), method, params);
	},

  /**
   * Sign up a new user
   * @param string username : username of user to create
   * @param string password : password of user to create
   * @param string email : email address of user
   * @param string name : name of user
   * @return array containing session_key, name, username, and user_id of the user;
   */
  signup: function(callback, username, password, email, name) {
		var method = "user.signup"
      , params = {
    		  username: username
		    , password: password
		    , email: email
		    , name: name || null
		  };

		return postRequest.bind(this)(callback, method, params);
	}
};

/**
 * Request helper
 */

function postRequest(callback, method, params) {
  var options = {uri: this.url};

  params = objectExtend({method: method}, params);
	params['api_sig'] = generateSig({
  	  method: method
  	, session_key: this.session_key
  	, my_user_id: this.my_user_id
	}, this.secret);

  if (params.file && fs.existsSync(params.file)) {
    options.headers = {'content-type' : 'multipart/form-data'},
    options.multipart = [{ 
        'Content-Disposition' : 'form-data; name="file"; filename="' + path.basename(params.file) + '"'
      , 'Content-Type' : mime.lookup(params.file)
      , body: fs.readFileSync(params.file)
    }];
    
    Object.keys(params).forEach(function(key) {
      key != 'file' && options.multipart.push({
          'Content-Disposition' : 'form-data; name="' + key + '"'
        , body: params[key]
      })
  	});
  } else {
    options.body = qs.stringify(params);    
  }

  return request.post(options, function(err, res, body) {
    if (err) return callback(err, body);
    try {
      body = xml2json(body, {object: true});
      if (body.rsp) {
        if (body.rsp.stat == 'fail') err = body.rsp.stat;
        callback(err, body.rsp);
      }
    } catch(e) {
      callback(body)
    }
  });
}


/**
 * Object extend
 */

function objectExtend(obj1, obj2) {
	obj2 && Object.keys(obj2).forEach(function(key) {
    	if (obj2[key]) obj1[key] = obj2[key];
  	});

	return obj1;
};


/**
 * Generate signature
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
 * Export intance of Scribd as the module
 */

module.exports = Scribd;