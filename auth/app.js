const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const {
  SECURITY,
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
app.use(passport.initialize());
// app.use(passport.session());

require('./src/config/passport')(app);

// routing
app.get('/', (rq, rs) => {
  rs.sendFile(path.join(__dirname, 'views/welcome.html'));
});

SECURITY(app);

app.use('/auth/v1', authRouter);


// port config
const server = app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});

module.exports = server;