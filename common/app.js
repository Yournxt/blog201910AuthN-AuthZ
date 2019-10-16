const authN = require('./src/auth/authenticate');
const authZ = require('./src/auth/authorize');
const SECURE = require('./src/auth/secure');
const token = require('./src/auth/generateToken');
const STATUS = require('./src/constants/STATUS');

module.exports = {
  authN,
  authZ,
  token,
  SECURE,
  STATUS,
}