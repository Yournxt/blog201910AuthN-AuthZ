const jwt = require('jsonwebtoken');
const debug = require('debug')('app: encoder');
const chalk = require('chalk');
const AUTH = require('../constants/AUTH');

// Generate JWT
function encodeToken30Days(data){
  const token = jwt.sign(
    data,
    AUTH.SECRET_KEY,
    { expiresIn: AUTH.EXPIRY_DAY.toString()+'d' }
  );
  debug(`generated token for system ${chalk.blue(JSON.stringify(data))} validity 30 day`);
  return token;
}
function encodeAuthToken1Day(data) {
  const token = jwt.sign(
    data,
    AUTH.SECRET_KEY,
    { expiresIn: '1d' }
  );
  debug(`generated token for system ${chalk.blue(JSON.stringify(data))} validity 1 day`);
  return token;
}

function generateSystemToken(userDetails, system) {
  const data = {...userDetails,...system};
  debug(`got data for token ${JSON.stringify(data)}`);
  const token = jwt.sign(
    data,
    AUTH.SECRET_KEY
  )
  return token;
}

module.exports = {
  encodeAuthToken1Day,
  generateSystemToken,
  encodeToken30Days
}
