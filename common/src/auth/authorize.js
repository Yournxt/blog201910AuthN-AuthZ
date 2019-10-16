const debug = require('debug')('app authZ')
const AUTH = require('../constants/AUTH');
const STATUS = require('../constants/STATUS');

module.exports = (req, res, next) => {
    debug('In authZ');
    const url = req._parsedUrl.pathname;
    if (AUTH.API.PUBLIC.includes(url)) return next();
    let found = false;
    if (req.plainToken) {
        const token = req.plainToken;
        debug(`got roles ${JSON.stringify(token.roles)}`);
        if (token.roles) {
            debug('got roles');
            token.roles.forEach(element => {
                debug(AUTH.API[element]);
                if (AUTH.API[element].includes(url)) found = true;
            });
        }
    }
    debug(`found: ${found}`);
    if (found) next();
    else res.status(STATUS.UNAUTHORIZED).send('Unauthorized request!');

};