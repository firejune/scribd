/*!
 * Scribd - Platform API Test
 *
 * Copyright(c) 2012 Joon Kyoung, @firejune <to@firejune.com>
 * MIT Licensed
 */


var Scribd = require('../index')
  , methods = require('../lib/methods')
  , clog = require('clog');

var key = "ENTER-YOUR-API-KEY-HERE"
  , secret = "ENTER-YOUR-API-SECRET-HERE"
  , scribd = new Scribd(key, secret, {debug: false})

  , failure = 0
  , success = 0
  , params = {
      file: './test.ppt'
    , url: 'http://scribd.firejune.com/test.pdf'
    , docType: 'ppt'
    , access: 'private'
    , title: 'testing'
    , query: 'Node.JS'
    , numResults: 1
    , limit: 2
    , width: 256
    , username: 'username'
    , password: 'userpass'
    , email: 'user@email.com'
  }
  , units = []
  , tests = {
    "docs.upload": function(r) {
      if (r.doc_id) params.docId = r.doc_id;
      if (r.access_key) params.accessKey = r.access_key;
      if (r.secret_password) params.secretPassword = r.secret_password;
      params.access = null;
      params.docType = 'pdf';
      params.file = './test.jpg';
      return r.doc_id && r.access_key && r.secret_password;
    },
    "docs.uploadFromUrl": function(r) {
      if (r.doc_id) params.docIds = r.doc_id;
      return r.doc_id && r.access_key && !r.secret_password;
    },
    "docs.getList": function(r) {
      if (r && r.result && r.result.length) {
        params.currentDocId = r.result[0].doc_id;
      }
      return r && r.result && !!r.result.length;
    },
    "docs.getConversionStatus": function(r) {
      return r == "PROCESSING" || r == "DONE" || r == "ERROR" || r == "DISPLAYABLE";
    },
    "docs.getSettings": function(r) {
      return params.accessKey == r.access_key
          && params.secretPassword == r.secret_password;
    },
    "docs.changeSettings": function(r) {
      params.docType = null;
      params._docId = params.docId;
      if (params.currentDocId) params.docId = params.currentDocId;
      return true;
    },
    "docs.getDownloadUrl": function(r) {
      params.docId = params._docId;
      return "string" == typeof r;
    },
    "docs.getStats": function(r) {
      params.docId = params._docId;
      return r && r.reads != undefined;
    },
    "docs.delete": function(r) {
      params.docId = params.docIds;
      return true;
    },
    "docs.search": function(r) {
      return r && r.result && r.result.length == 1;
    },
    "docs.getCategories": function(r) {
      return r && r.result && !!r.result.length;
    },
    "docs.featured": function(r) {
      return r && r.result && r.result.length == 2;
    },
    "docs.browse": function(r) {
      return r && r.result && r.result.length == 2;
    },
    "docs.uploadThumb": function(r) {
      return true;
    },
    "thumbnail.get": function(r) {
      return "string" == typeof r;
    },
    "user.login": function(r) {
      return r.session_key && r.user_id && r.username;
    },
    "user.signup": function(r) {
      return r.session_key && r.user_id && r.username;
    },
    "user.getAutoSigninUrl": function(r) {
      return "string" == typeof r;
    }
  };


/**
 * Align test units form 'tests'
 */

Object.keys(tests).forEach(function(key) {

  var model = key.split('.')[0]
    , method = key.split('.')[1]
    , func = methods[model][method] + ''
    , pre = func.split('function (options, ')[1] || ''
    , args = pre.split(') {\n')[0];

  units.push({
      model: model
    , method: method
    , args: args
    , ok: tests[model + "." + method] || function() {}
  });

});


units.reverse();
run();


function run() {
  var test = units.pop()
    , args = test.args.split(',').map(function(arg) {
        return params[arg.trim()] || null;
      })
    , callback = function(err, res) {
      if (err) {
        clog.error(res && res.code || 'unknown', res && res.message || res);
        failure++;
      } else {
        if (test.ok(res)) {
          clog.info('ok');
          success++;
        } else {
          clog.warn('not ok', res);
          failure++;
        }
      }

      if (units.length) {
        run();
      } else {
        scribd.delete(function(err, res) {
          clog('Test finished', 'success ' + success + ', failure ' + failure);
        }, params.docId);
      }
    };

  clog('Test', 'scribd.' + test.model + '.' + test.method, args);
  scribd[test.model][test.method].apply(scribd, [callback].concat(args));
}