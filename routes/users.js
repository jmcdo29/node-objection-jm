const router = require('express').Router();
const { User } = require('../db/models/user_schema');
const passport = require('passport');
require("../passport/passport-local")(passport);

router
  .get('/signup', alreadyLoggedIn, (req, res, next) => {
    res.render('signup');
  })
  .post('/signup', alreadyLoggedIn, passport.authenticate('local-signup', {
    failureRedirect: '/users/signup'
  }), (req, res, next) => {
    res.redirect('/ideas');
  })
  .get('/login', alreadyLoggedIn, (req, res, next) => { 
    //console.log(req);
    res.render('login');
  })
  .post('/login', alreadyLoggedIn, passport.authenticate('local-login', {
    failureRedirect: '/users/login'
  }), (req, res, next) => {
    res.redirect('/ideas');
  })
  .post('/logout', loggedIn, (req, res, next) => {
    req.logout();
    res.redirect('/');
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