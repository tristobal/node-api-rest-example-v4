// middleware.js
var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('./config');

exports.ensureAuthenticated = function(req, res, next) {
    console.log(req);
    /**
	 * Take the token from:
	 *
	 *  - the POST value access_token
	 *  - the x-access-token header
	 *    ...in that order.
	 */
    var token = (req.body && req.body.access_token) || req.headers["x-access-token"];

    if (token) {
        try {
            var payload = jwt.verify(token, config.PUBLIC_KEY, { algorithms: ['RS512']});
            if(payload.exp <= moment().unix()) {
                return res.status(401).send({message: "Token expired"});
            }
            //req.user = payload.sub;
            next();
        } catch (err){
            return res.status(401).send({message: "Invalid Token"});
        }

    } else {
        return res.end('Not authorized', 401);
    }
};
