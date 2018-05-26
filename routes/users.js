const router = require('express').Router();
const { User } = require('../db/models/user_schema');
const passport = require('passport');
require("../passport/passport-local")(passport);

router
  .get('/signup', alreadyLoggedIn, (req, res, next) => {
    const error = req.flash('error');
    console.log('REQ.flash("error"):', error);
    res.render('signup', {error: error});
  })
  .post('/signup', alreadyLoggedIn, passport.authenticate('local-signup', {
    failureRedirect: '/users/signup',
    failureFlash: 'That email is already taken. Please try again.',
    successFlash: 'Welcome to my app of ideas!'
  }), (req, res, next) => {
    res.redirect('/ideas');
  })
  .get('/login', alreadyLoggedIn, (req, res, next) => { 
    const error = req.flash('error');
    console.log('REQ flash error:', error);
    res.render('login', {errorMsg: error});
  })
  .post('/login', alreadyLoggedIn, passport.authenticate('local-login', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password.',
    successFlash: 'Welcome to my app of ideas!'
  }), (req, res, next) => {
    res.redirect('/ideas');
  })
  .get('/logout', loggedIn, (req, res, next) => {
    req.logout();
    res.redirect('/');
  });

function alreadyLoggedIn(req, res, next) {
  if (req.user) {
    req.flash('signedIn', 'You are already signed in. Please log out to use a different account.');
    res.redirect('/ideas');
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