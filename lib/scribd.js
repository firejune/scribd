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
  , utils = require('./utils');


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

  this.version = '0.1.7';

  this.options = utils.extend({
      debug: false
    , secret: secret
    , url: "http://api.scribd.com/api?api_key=" + apikey
  }, options || arguments[0]);

  this.request = request(this.options);
};


/**
 * Align methods form 'methods'
 */
Scribd.prototype = (function() {
  var _methods = {};

  Object.keys(methods).forEach(function(model) {
    _methods[model] = {};

    Object.keys(methods[model]).forEach(function(method) {
      _methods[model][method] = function() {
        var reference = methods[model][method].apply({}, arguments)
          , params = utils.extend({method: model + '.' + method}, reference.params)
          , callback = 'function' == typeof(arguments[1]) ? arguments[1] : arguments[0]
          , returns = reference.returns;

        this.request(params, function(err, res) {
          if (!err && model == 'user' && method == 'login') {
            this.options.sessionKey = res['session_key'];
          }
          if (returns == 'result_set' && res && res[returns]
            && res[returns].result && !res[returns].result.length) {
            res[returns].result = [res[returns].result];
          }
          callback && callback(err, res && res[returns] || res);
        }.bind(this));
      };

      if (model == 'docs' || model == 'user') _methods[method] = _methods[model][method];
      if (model == 'thumbnail') _methods.getThumbnail = _methods[model][method];
    });   
  });

  return _methods;
})();