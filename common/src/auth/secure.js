const authentication = require('./authenticate');
const authorization = require('./authorize');

module.exports = function secure(app) {
  app.use(authentication);
  app.use(authorization);
}