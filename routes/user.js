const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

const User = require("../models/user");

router.post("/register", (req, resp, next) => {
  // resp.send("register");
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err) {
      resp.json({success: false, msg: "Failed to register user"})
    } else {
      resp.json({success: true, msg: "User registered"})
    }
  })
})

router.post("/authenticate", (req, resp, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user)=>{
    if(err) {
      throw err;
    }

    if(!user) {
      return resp.json({success: false, msg: "user not found"})
    }

    User.comparePassword(password, user.password, (err, isMatch)=> {
      if(err) {
        throw err;
      }

      if(isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800
        });

        resp.json({
          success: true,
          token: "JWT " + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        })
      } else {
        return resp.json({success: false, msg: "Wrong password"})
      }
    })
  })
});

router.get("/profile", passport.authenticate('jwt', {session:false}),
  (req, resp, next) => {
    resp.json({user: req.user})
})

module.exports = router;
