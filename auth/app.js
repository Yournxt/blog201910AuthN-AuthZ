const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
  SECURE,
  STATUS
} = require('common');
const authRouter = require('./src/routes/mainAuth');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());


SECURE(app);
app.route('/').get((rq, rs) => {
  rs.status(STATUS.OK).send('Auth is up');
});
app.use('/auth/v1', authRouter);


// port config
const server = app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});

module.exports = server;