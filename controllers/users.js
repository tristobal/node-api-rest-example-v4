var mongoose = require("mongoose");
var moment = require('moment');
var jwt = require('jsonwebtoken');

var config = require('../config');

var User = mongoose.model("User");

exports.addUser = function(req, res) {
    var user = new User({
        email:    req.body.email,
        password: req.body.password,
        nickname: req.body.nickname
    });

    user.save(function(err, jsonResp) {
        if(err) {
            // duplicate entry
            if (err.code == 11000) {
                return res.status(500).send('A user with that email already exists.');
            } else {
                return res.status(500).send(err.message);
            }
        }
        res.status(200).jsonp(jsonResp);
    });
};

exports.getAll = function(req, res) {
    User.find({}).exec(function(err, users) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(users);
    });
};

exports.update = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) {
                    // an error has occured checking the password. For simplicity, just return a 401
                    res.send('Authentication error', 401);
                } else {
                    if (isMatch) {
                        //update the users info only if its new
                        if (req.body.email) {
                            user.email = req.body.email;
                        }
                        if (req.body.new_password) {
                            user.password = req.body.new_password;
                        }
                        if (req.body.nickname) {
                            user.nickname = req.body.nickname;
                        }

                        // save the user
                        user.save(function(err) {
                            if (err) res.send(err);
                            // return a message
                            res.json({ message: 'Successfully updated' });
                        });
                    } else {
                        // The password is wrong...
                        res.send('Incorrect password', 401);
                    }
                }
            });
        }
    });
};

exports.getUser = function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {

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
                        var expires = moment().add(1, "days").unix(); //moment().add('days', 7).valueOf();
                        var jsonClaims = {
                            "sub": user.id,
                            "exp": expires
                        };
                        var token = jwt.sign(jsonClaims, config.PRIVATE_KEY, { algorithm: 'RS512' });

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
