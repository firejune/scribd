/*!
 * Scribd - User methods
 *
 * Copyright(c) 2012 Joon Kyoung, @firejune <to@firejune.com>
 * MIT Licensed
 */


/**
 * Module dependencies
 */

var utils = require('../utils');

 
/**
 * Login as a user
 * @param string username: (required) username of user to log in
 * @param string password: (required) password of user to log in
 * @return array containing session_key, name, username, and user_id of the user;
 */
exports.login = function(options, username, password) {
  return {
    params: utils.extend({
        username: username
      , password: password
    }, options)
  };
};

/**
 * Sign up a new user
 * @param string username: (required) username of user to create
 * @param string password: (required) password of user to create
 * @param string email: (required) email address of user
 * @param string name: (optional) name of user
 * @return array containing session_key, name, username, and user_id of the user;
 */
exports.signup = function(options, username, password, email, name) {
  return {
    params: utils.extend({
        username: username
      , password: password
      , email: email
      , name: name || null
    }, options)
  };
};

/**
 * Get automatically sign URL
 * @return string url
 */
exports.getAutoSigninUrl = function(options, nextUrl) {
  return {
    params: utils.extend({next_url: nextUrl || '/'}, options),
    returns: 'url'
  };
};