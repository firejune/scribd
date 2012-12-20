/*!
 * Scribd - PostRequest
 *
 * Copyright(c) 2012 Joon Kyoung, @firejune <to@firejune.com>
 * MIT Licensed
 */


/**
 * Module dependencies
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
 * Export postRequest as the module
 */
 
exports = module.exports = postRequest;


/**
 * postRequest
 */

function postRequest(settings) {

  var parser = new xml2js.Parser({
      explicitArray: false
    , mergeAttrs: true
  });

  return function(params, callback) {
    if (settings.debug) clog('Scribd', params, settings);
  
    var options = {uri: settings.url};

    params['api_sig'] = generateSig({
        method: params.method
      , session_key: settings.sessionKey
      , my_user_id: settings.myUserId
    }, settings.secret);
  
    if (params.file) {
      if (!fs.existsSync(params.file)) {
        return callback(new Error('File not found'));
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
      if (err) return callback(err, body);

      try {
        
        parser.parseString(body, function(err, data) {
          if (err) return callback(new Error(body));
    
          if (data.rsp) {
            data = data.rsp;
    
            if (data.stat == 'fail') {
              err = data.stat;
              data = data.error;
            }
            delete data.stat;
    
            callback(err, data);
          }
        });

      } catch(e) {
        callback(e);
      }

    });
  };
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