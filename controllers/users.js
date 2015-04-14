var mongoose = require("mongoose");
var moment = require('moment');
var jwt = require('jwt-simple');

//Nombre del modelo definido en ../models/tvshow.js
var User = mongoose.model("User");

exports.addUser = function(req, res) {
    var user = new User({
        username:    req.body.username,
        password: 	 req.body.password
    });

    user.save(function(err, jsonResp) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(jsonResp);
    });
};


exports.getUser = function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {

        if (err || !user) {
            // user cannot be found; may wish to log that fact here. For simplicity, just return a 401
            res.send('Authentication error', 401);
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) {
                    // an error has occured checking the password. For simplicity, just return a 401
                    res.send('Authentication error', 401);
                } else {
                    if (isMatch) {

                        // Great, user has successfully authenticated, so we can generate and send them a token.
                        //TODO Deprecation warning: moment().add(period, number) is deprecated. Please use moment().add(number, period).
                        var expires = moment().add('days', 7).valueOf();
                        var token = jwt.encode(
                            {
                                iss: user.id,
                                exp: expires
                            },
                            //TODO Cambiar a app.get('jwtTokenSecret')
                            "token_secreto"
                        );
                        res.json({
                            token : token,
                            expires : expires,
                            user : user.toJSON()
                        });
                    } else {
                        // The password is wrong...
                        res.send('Authentication error', 401);
                    }
                }
            });
        }
    });
};
