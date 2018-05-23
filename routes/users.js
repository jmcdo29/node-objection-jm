const router = require('express').Router();
const { User } = require('../db/models/user_schema');
const passport = require('passport');
require("../passport/passport-local")(passport);
//const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


router
  .get('/', (req, res, next) => {
    console.log("That's a get to /users!");
    res.status(200).send({ message: 'hi' });
  })
  .post('/signup', alreadyLoggedIn, passport.authenticate('local-signup'), (req, res, next) => {
    res.status(200).send({ message: 'POST to signup' });
  })
  .post('/login', alreadyLoggedIn, passport.authenticate('local-login'), (req, res, next) => {
    console.log('Made post with passport');
    //console.log('RES:', res);
    console.log('REQ:', req.user);
    // console.log('Next:', next);
    res.status(200).send({message :'You have successfully logged in.'});
  })
  .post('/logout', loggedIn, (req, res, next) => {
    console.log('REQ.User:', req.user);
    req.logout();
    console.log('You have logged out.');
    console.log('REQ.uers:', req.user);
    res.status(200).send({message: 'You have logged out.'});
  });

function alreadyLoggedIn(req, res, next) {
  if (req.user) {
    res.status(302).send({message: 'You are already logged in. Log out to sign in as a different user or to create a new user!'});
  } else {
    next();
  }
}

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
