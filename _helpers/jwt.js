const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../users/users.service');
//const hospitalService = require('../hospital/hospital.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            // '/users',
            // '/users/authenticate',
            // '/postads/newads',
           '/api/users',
            '/api/users/authenticate',
           '/api/users/register'
            
        ]
    });
}

async function isRevoked(req, payload, done) {
    const users = await userService.getById(payload.sub);
    if (!users) {
        return done(null, true);
    }
    done();
};