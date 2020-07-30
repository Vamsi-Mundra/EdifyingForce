"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
var { secret } = require("./config");
const student = require('../db/schema/candidate').createModel();
const company = require('../db/schema/mentor').createModel();

function auth() {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret
    };
    passport.use(
        new JwtStrategy(opts, (jwt_payload, callback) => {
            const id = jwt_payload.id;
            const model = (jwt_payload.persona === "student" ? student : company)
            model.find({id}, (err, results) => {
                if (err) {
                    return callback(err, false);
                }
                if (results) {
                    callback(null, results);
                }
                else {
                    callback(null, false);
                }
            });
        })
    )
}

exports.auth = auth;
exports.checkAuth = passport.authenticate("jwt", { session: false });
