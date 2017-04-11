'use strict';

/* Middleware simply for simplying when in development
 * mode so that you do not have to re-login everytime the
 * node server reboots. set global.LOGIN_USER to the user you wish
 * to automatically login as.
 */

const { getAuthenticationDetails } = require('../services/users/handlers');

module.exports = function automaticLogin(req, res, next) {
  if (global.LOGIN_USER && !req.user) {
    getAuthenticationDetails(LOGIN_USER)
      .then((user) => req.login(user))
      .then(() => next())
      .catch(next);
  } else {
    next();
  }
};
