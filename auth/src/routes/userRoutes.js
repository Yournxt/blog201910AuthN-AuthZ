const express = require('express');
const debug = require('debug')('app: localReg');
const {
  User,
  QUERY,
  db,
  STATUS,
  REQUEST,
  PATH,
  ENCODE,
  SESSION,
  CONST,
} = require('vida-micro-common');
const _ = require('lodash');
const dateformat = require('dateformat');
const bcrypt = require('bcrypt');
const nominee = require('../util/nominee');
const email = require('../util/verificationEmail');

const userRouter = express.Router();
const todayDate = dateformat(new Date(), 'mm/dd/yyyy');

userRouter.route('/user').post(async (rq, rs) => {
  const userData = rq.body;
  if (!userData.username) return rs.status(400).send('No user name');

  const user = new User();
  user.username = userData.username.toLowerCase();
  user.fName = userData.fName;
  user.lName = userData.lName;
  user.password = userData.password;
  const {
    sub,
  } = userData;

  const {
    error,
  } = user.isValid();
  if (error) return rs.status(400).send(error.details[0].message);
  const deviceId = rq.header(CONST.HEADER.deviceId);
  const deviceName = rq.header(CONST.HEADER.deviceName);
  if (!deviceId || !deviceName) return rs.status(STATUS.FORBIDDEN).send('Unknown Device!');

  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);

  db.query(QUERY.USER.selectUserQuery, [user.username], (err, resp) => {
    if (err) return rs.status(500).send(err);
    if (resp.rows[0]) return rs.status(400).send('User is already registered!');
    const values = [user.username,
      userData.fName,
      userData.lName,
      userData.password,
      userData.ssn,
      true,
      false,
      user.username,
      null,
      todayDate,
      todayDate,
      'system',
      'system',
    ];

    const list = [];
    list.push(db.queryPromise(QUERY.USER.insertUserQuery, values));
    list.push(db.queryPromise(QUERY.USER_VERFICATION.insertVerfication, [userData.username]));
    list.push(db.queryPromise(QUERY.USER_RIGHTS.addRegular, [userData.username]));
    Promise.all(list).then((pValues) => {
      const session = SESSION.createFreshSession(user.username, deviceId, deviceName);
      rq.session = session;
      rq.username = user.username;

      const date = new Date();
      date.setSeconds(0);
      const userArray = {
        username: user.username,
        name: userData.fName,
        roles: ['REGULAR'],
        updatedDate: date,
      };
      REQUEST.POST(PATH.USER.detailsAdd, {
        userDetails: {},
      }, userArray, (errUD) => {
        if (errUD) debug(`Error adding user details! ${JSON.stringify(errUD)}`);
      });
      email.send(userArray);
      // prepare JWT token and send back
      const token = ENCODE.encodeToken30Days(userArray);
      debug(session);

      if (sub) nominee.add(userArray, sub);
      rs.header(CONST.HEADER.authToken, token).header(CONST.HEADER.roles, userArray.roles).send('Authentication successfull');
    }).catch((errors) => {
      rs.status(STATUS.INTERNAL_SERVER_ERROR).send(errors);
    });
  });
});

module.exports = userRouter;