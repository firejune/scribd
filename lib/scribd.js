/*!
 * Scribd - Unofficial NodeJS library
 *
 * Copyright(c) 2012 Firejune <to@firejune.com>
 * MIT Licensed
 */


var fs = require('fs')
  , qs = require('querystring')
  , crypto = require('crypto')
  , path = require('path')
  , mime = require('mime')
  , request = require('request')
  , xml2js = require('xml2js');


/**
 * Scribd class
 */

function Scribd(apikey, secret) {

  this.version = '0.1.4';
	this.apikey = apikey;
	this.secret = secret;
	this.parser = new xml2js.Parser({mergeAttrs: true});
	this.url = "http://api.scribd.com/api?api_key=" + apikey;  

};


/**
 * Docs Method
 */
 
/**
 * Upload a document from a file
 * @param string file : relative path to file
 * @param string doc_type : PDF, DOC, TXT, PPT, etc.
 * @param string access : public or private. Default is Public.
 * @param int rev_id : id of file to modify
 * @return array containing doc_id, access_key, and secret_password if nessesary.
 */
Scribd.prototype.upload = function(callback, file, docType, access, revId) {
	var method = "docs.upload"
	  , params = {
		    file: file
	    , doc_type: docType || null
	    , access: access || null
	    , rev_id: revId || null
	  };

	postRequest.bind(this)(callback, method, params);
};

/**
 * Upload a document from a Url
 * @param string url : absolute URL of file 
 * @param string doc_type : PDF, DOC, TXT, PPT, etc.
 * @param string access : public or private. Default is Public.
 * @return array containing doc_id, access_key, and secret_password if nessesary.
 */
Scribd.prototype.uploadFromUrl = function(callback, url, docType, access, revId) {
	var method = "docs.uploadFromUrl"
	  , params = {
  		  url: url
	    , doc_type: docType || null
	    , access: access || null
	    , rev_id: revId || null
	  };

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
 * @param int doc_id : document id
 * @return string containing DISPLAYABLE", "DONE", "ERROR", or "PROCESSING" for the current document.
 */
Scribd.prototype.getConversionStatus = function(callback, docId) {
	var method = "docs.getConversionStatus"
	  , params = {doc_id: docId};

	return postRequest.bind(this)(function(err, res) {
	  callback && callback(err, res.conversion_status || res);
	}, method, params);
};

/**
 * Get settings of a document
 * @return array containing doc_id, title , description , access, tags, show_ads, license, access_key, secret_password
 */
Scribd.prototype.getSettings = function(callback, docId) {
	var method = "docs.getSettings"
	  , params = {doc_id: docId};

	return postRequest.bind(this)(callback, method, params);
};

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
Scribd.prototype.changeSettings = function(callback, docIds, title, description, access, license, showAds, tags) {
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
};

/**
 * Delete a document
 * @param int doc_id : document id
 * @return 1 on success;
 */
Scribd.prototype.remove = function(callback, docId) {
	var method = "docs.delete"
	  , params = {doc_id: docId};

	return postRequest.bind(this)(callback, method, params);
};

/**
 * Search the Scribd database
 * @param string query : search query
 * @param int num_results : number of results to return (10 default, 1000 max)
 * @param int num_start : number to start from
 * @param string scope : scope of search, "all" or "user"
 * @return array of results, each of which contain doc_id, secret password, access_key, title, and description
 */
Scribd.prototype.search = function(callback, query, numResults, numStart, scope) {
	var method = "docs.search"
    , params = {
  		  query: query
	    , num_results: numResults || null
	    , num_start: numStart || null
	    , scope: scope || null
	  };

	return postRequest.bind(this)(function(err, res) {
	  callback && callback(err, res.result_set || res);
	}, method, params);
};


/**
 * Thumbnail method
 */

/**
 * Get thumbnai of a document
 * @param int doc_id : document id
 * @param int whdth : width of thumbnail image
 * @param int whdth : height of thumbnail image
 * @return string thumbnail_url
 */
Scribd.prototype.getThumbnail = function(callback, docId, width, height) {
	var method = "thumbnail.get"
    , params = {
  		  doc_id: docId
	    , width: width
	    , height: height || width
	  };

	return postRequest.bind(this)(function(err, res) {
	  callback && callback(err, res.thumbnail_url || res);
	}, method, params);
};


/**
 * User method
 */
 
/**
 * Login as a user
 * @param string username : username of user to log in
 * @param string password : password of user to log in
 * @return array containing session_key, name, username, and user_id of the user;
 */
Scribd.prototype.login = function(callback, username, password) {
	var method = "user.login"
    , params = {
  		  username: username
	    , password: password
	  };

	return postRequest.bind(this)(function(err, res) {
		if (!err) this.session_key = res['session_key'];
		callback && callback(err, res);
	}.bind(this), method, params);
};

/**
 * Sign up a new user
 * @param string username : username of user to create
 * @param string password : password of user to create
 * @param string email : email address of user
 * @param string name : name of user
 * @return array containing session_key, name, username, and user_id of the user;
 */
Scribd.prototype.signup = function(callback, username, password, email, name) {
	var method = "user.signup"
    , params = {
  		  username: username
	    , password: password
	    , email: email
	    , name: name || null
	  };

	return postRequest.bind(this)(callback, method, params);
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
        callback && callback(err, data);
      }
    });

  }.bind(this));
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