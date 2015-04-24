var fs = require('fs');
var public_key = fs.readFileSync(__dirname + '/keys/server.crt').toString('ascii');
var private_key = fs.readFileSync(__dirname + '/keys/server.key').toString('ascii');

module.exports = {
    TOKEN_SECRET : "tokensecreto",
    DATABASE_MONGOLABS: 'mongodb://user_db:pass_db@ds029051.mongolab.com:29051/mongotest',
    DATABASE_LOCAL: 'mongodb://localhost/jwttest',
    PRIVATE_KEY: private_key,
    PUBLIC_KEY: public_key,
};
