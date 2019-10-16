const express = require('express');
const debug = require('debug')('app: localAuth');
const {
  QUERY,
  db,
  STATUS,
  generateToken,
  SESSION,
  CONST,
} = require('vida-micro-common');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const authRoutes = express.Router();

authRoutes.route('/').post(async (rq, rs) => {
  // read user from request.. and fetch the same form our DB
  // to make sure the user is registered and exists in our DB..
  debug('Local auth');
  const userDetails = rq.body;
  if (!(userDetails.username && userDetails.password)) {
    return rs.status(STATUS.FORBIDDEN).send('Username and Password are required');
  }
  const deviceId = rq.header(CONST.HEADER.deviceId);
  const deviceName = rq.header(CONST.HEADER.deviceName);
  if (!deviceId || !deviceName) return rs.status(STATUS.FORBIDDEN).send('Unknown Device!');

  db.query(QUERY.USER.selectUserQuery, [userDetails.username], async (err, res) => {
    if (err) return rs.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    if (!res.rows[0]) return rs.status(STATUS.UNAUTHORIZED).send('user not found');
    const validPassword = await bcrypt.compare(userDetails.password, res.rows[0].pwd);
    if (!validPassword) return rs.status(STATUS.UNAUTHORIZED).send('Invalid credentials');
    const userdata = res.rows[0];
    generateToken.generate(userDetails.username, userdata, (errT, resT) => {
      if (errT) return rs.status(500).send(errT);
      SESSION.addDeviceOrCreateNew(userDetails.username, deviceId, deviceName, (errS, resS) => {
        if (errS) return rs.status(500).send(errS);
        if (resS) rq.session = resS;
        rq.username = userDetails.username;
        rs.header(CONST.HEADER.authToken, resT.encoded).header(CONST.HEADER.roles, resT.plain.roles).send('Authentication successfull');
      });
    });
  });
});

module.exports = authRoutes;