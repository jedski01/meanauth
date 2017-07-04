const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("./database");

module.exports = function(passport) {
  let opts = {}

  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;

  let strategy = new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);
    User.getUserById(jwt_payload._doc._id, (err, user)=> {
      if(err) {
        console.err(err);
        return done(err, false);
      }

      if(user) {
        return done(null, user);
      }

      return done(null, false);
    })
  });

  passport.use(strategy);

}
