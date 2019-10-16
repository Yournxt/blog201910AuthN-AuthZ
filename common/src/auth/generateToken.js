const QUERY = require('../constants/QUERY');
const ENCODE = require('../auth/jwt.encoder');
const debug = require('debug')('app: generateToken');

const generate = (userdata, done) => {
  const userArray = {
    username: userdata.username,
    name: userdata.f_name,
    roles: userdata.role,
    updatedDate: new Date(),
  };
  // prepare JWT token and send back
  try {
    const token = ENCODE.encodeToken30Days(userArray);
    const build = {};
    build.encoded = token;
    build.plain = userArray;
    return done(null, build);
  } catch (err) {
    done(err);
  }
};

module.exports = {
  generate,
};