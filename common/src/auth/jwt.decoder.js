const jwt = require('jsonwebtoken');
const debug = require('debug')('app authN')
const AUTH = require('../constants/AUTH');
const STATUS = require('../constants/STATUS');

// Decrypt JWT
function decodeToken(enc, done) {
  try {
    const decrypt = jwt.verify(token, AUTH.SECRET_KEY)
    done(null, decrypt);
  } catch (ex) {
    done(ex);
  }
}

module.exports = {
  decodeToken,
}