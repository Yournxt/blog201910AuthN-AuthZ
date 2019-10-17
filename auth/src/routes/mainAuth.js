const express = require('express');
const {
  STATUS,
  token,
  CONST,
} = require('common');

const authRoutes = express.Router();

// Auth
authRoutes.route('/login').get((rq, rs) => {
  const userdata = {};
  userdata.username = '1';
  userdata.f_name = 'One';
  userdata.role = ['REGULAR'];
  try {
    token.generate(userdata, (err, token) => {
      rs.header(CONST.AUTH.tokenHeader, token.encoded);
      rs.status(STATUS.OK).send('Hello regular, token in the header');
    });
  } catch (err) {
    return rs.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
  }
});
authRoutes.route('/loginAdmin').get((rq, rs) => {
  const userdata = {};
  userdata.username = '2';
  userdata.f_name = 'Admin';
  userdata.role = ['REGULAR', 'ADMIN'];
  try {
    token.generate(userdata, (err, token) => {
      rs.header(CONST.AUTH.tokenHeader, token.encoded);
      rs.status(STATUS.OK).send('Hello Admin, token in the header');
    });
  } catch (err) {
    return rs.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
  }
});
authRoutes.route('/regular').get((rq, rs) => {
  rs.status(STATUS.OK).send('Hello from regular');
});
authRoutes.route('/admin').get((rq, rs) => {
  rs.status(STATUS.OK).send('Hello from admin');
});
module.exports = authRoutes;