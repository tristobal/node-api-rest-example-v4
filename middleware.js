// middleware.js
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');

exports.ensureAuthenticated = function(req, res, next) {

    /*
    if(!req.headers.authorization) {
        return res.status(403).send({message: "La petición no tiene cabecera de autorización"});
    }

    var token = req.headers.authorization.split(" ")[1];
    */

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
            var payload = jwt.decode(token, config.TOKEN_SECRET);

            if(payload.exp <= moment().unix()) {
                return res.status(401).send({message: "El token ha expirado"});
            }

            //req.user = payload.iss;
            next();

        } catch(err) {
            return res.end('Not authorized', 401);
        }

    } else {
        return res.end('Not authorized', 401);
    }
};
