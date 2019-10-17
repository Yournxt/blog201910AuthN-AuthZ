const jwt = require('jsonwebtoken');
const debug = require('debug')('app authN')
const AUTH = require('../constants/AUTH');
const STATUS = require('../constants/STATUS');
const generateToken = require('./generateToken');

module.exports = (req, res, next) => {
  debug('In authN');
  var url = req._parsedUrl.pathname;
  debug(`Called URL: ${url}`);
  if (AUTH.API.PUBLIC.includes(url)) {
    debug('Unrestricted public access');
    return next();
  } else {
    const token = req.header('x-auth-token');
    debug(`got token: ${token}`);
    req.plainToken = null;
    if (!token) return res.status(STATUS.UNAUTHORIZED).send('Unauthenticated access!');
    try {
      const decoded = jwt.verify(token, AUTH.SECRET_KEY);
      debug(`debuged token ${JSON.stringify(decoded)}`);
      req.plainToken = decoded;
      next();
    } catch (ex) {
      debug(`Error decrypting token ${JSON.stringify(ex)}`);
      res.status(STATUS.FORBIDDEN).send('Unauthenticated access!');
    }
  }
};