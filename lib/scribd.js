/*!
 * Scribd - Unofficial NodeJS library
 *
 * Copyright(c) 2012 Joon Kyoung, @firejune <to@firejune.com>
 * MIT Licensed
 */


/**
 * Module dependencies
 */

var request = require('./request')
  , methods = require('./methods')
  , utils = require('./utils')
  , emitter = require('events').EventEmitter;


/**
 * Export Scribd as the module
 */

module.exports = Scribd;


/**
 * Scribd class
 * @param string apikey: (required) API key.
 * @param string secret: (required) API secret.
 * @param string options: (optional) debug flag.
 * @return object Scribd instant.
 */
function Scribd(apikey, secret, options) {
  emitter.call(this);

  this.version = '0.1.8';

  this.options = utils.extend({
      debug: false
    , secret: secret
    , url: "http://api.scribd.com/api?api_key=" + apikey
  }, options || arguments[0]);

  this.request = request(this.options);
};

utils.inherits(Scribd, emitter);

/**
 * Align methods form 'methods'
 */

Object.keys(methods).forEach(function(model) {
  var _proto = Scribd.prototype[model] = {};

  Object.keys(methods[model]).forEach(function(method) {
    _proto[method] = function() {

      var reference = methods[model][method].apply({}, arguments)
        , params = utils.extend({method: model + '.' + method}, reference.params)
        , callback = 'function' == typeof(arguments[1]) ? arguments[1] : arguments[0]
        , returns = reference.returns;

      return this.request(params, function(err, res) {
        if (!err && model == 'user' && method == 'login') {
          this.options.sessionKey = res['session_key'];
        }

        if (returns == 'result_set'
          && res && res[returns] && !utils.isArray(res[returns].result)) {
          res[returns].result = [res[returns].result];
        }

        if (method == 'upload' || method == 'uploadFromUrl')
          checkState.call(this, {retry:0, docId:res.doc_id});

        callback && callback(err, res && res[returns] || res);
      }.bind(this));

    };

    if (model == 'docs' || model == 'user') Scribd.prototype[method] = _proto[method];
    if (model == 'thumbnail') Scribd.prototype.getThumbnail = _proto[method];
    
  });
});

function checkState(data) {
  if (data.retry > 100)
    return this.emit('conversion', new Error('Fail'), data.docId);

  this.getConversionStatus(function(err, state) {
    if (err) this.emit('conversion', new Error(err), data.docId);
    else if (state == "DONE") this.emit('conversion', null, data.docId);
    else setTimeout(checkState.bind(this, data), 1000);
  }.bind(this), data.docId);

  data.retry++;
}