var Scribd = require('../index')
  , methods = require('../lib/methods')
  , clog = require('clog');

var key = "ENTER-YOUR-API-KEY-HERE"
  , secret = "ENTER-YOUR-API-SECRET-HERE";
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
    "docs": {
      "upload": function(r) {
        if (r.doc_id) params.docId = r.doc_id;
        if (r.access_key) params.accessKey = r.access_key;
        if (r.secret_password) params.secretPassword = r.secret_password;
        params.access = null;
        params.docType = 'pdf';
        return r.doc_id && r.access_key && r.secret_password;
      },
      "uploadFromUrl": function(r) {
        if (r.doc_id) params.docIds = r.doc_id;
        return r.doc_id && r.access_key && !r.secret_password;
      },
      "getList": function(r) {
        if (r && r.result && r.result.length) {
          params.currentDocId = r.result[0].doc_id;
        }
        return r && r.result && !!r.result.length;
      },
      "getConversionStatus": function(r) {
        return r == "PROCESSING" || r == "DONE" || r == "ERROR" || r == "DISPLAYABLE";
      },
      "getSettings": function(r) {
        return params.accessKey == r.access_key
            && params.secretPassword == r.secret_password;
      },
      "changeSettings": function(r) {
        params.docType = null;
        params._docId = params.docId;
        if (params.currentDocId) params.docId = params.currentDocId;
        return true;
      },
      "getDownloadUrl": function(r) {
        params.docId = params._docId;
        return "string" == typeof r;
      },
      "getStats": function(r) {
        params.docId = params._docId;
        return r && r.reads != undefined;
      },
      "delete": function(r) {
        params.docId = params.docIds;
        return true;
      },
      "search": function(r) {
        return r && r.result && r.result.length == 1;
      },
      "getCategories": function(r) {
        return r && r.result && !!r.result.length;
      },
      "featured": function(r) {
        return r && r.result && r.result.length == 2;
      },
      "browse": function(r) {
        return r && r.result && r.result.length == 2;
      },
      "uploadThumb": function(r) {
        return true;
      }
    },
    "thumbnail": {
      "get": function(r) {
        return "string" == typeof r;
      }
    },
    "user": {
      "login": function(r) {
        return r.session_key && r.user_id && r.username;
      },
      "signup": function(r) {
        return r.session_key && r.user_id && r.username;
      },
      "getAutoSigninUrl": function(r) {
        return "string" == typeof r;
      }
    }
  };


/**
 * Align test units form 'methods'
 */

Object.keys(methods).forEach(function(model) {
  Object.keys(methods[model]).forEach(function(method) {
    var func = methods[model][method] + ''
      , pre = func.split('function (options, ')[1] || ''
      , args = pre.split(') {\n')[0];
      
    units.push({
        model: model
      , method: method
      , args: args
      , ok: tests[model] && tests[model][method] || function() {}
    });
  });   
});

units.reverse();
run();

function run() {
  var unit = units.pop()
    , args = unit.args.split(',').map(function(arg) {
        return params[arg = arg.trim()] || null;
      })
    , callback = function(err, res) {
      if (err) {
        clog.error(res && res.code || res);
        failure++;
      } else {
        if (unit.ok(res)) {
          clog.info('ok');
          success++;
        } else {
          clog.warn('not ok');
          failure++;
        }
      }

      if (units.length) {
        run();
      } else {
        scribd.delete(function() {
          clog('Test finished', 'success ' + success + ', failure ' + failure);
        }, params.docId);
      }
    };

  clog('Test', 'scribd.' + unit.model + '.' + unit.method, args);
  scribd[unit.model][unit.method].apply(scribd, [callback].concat(args));
}