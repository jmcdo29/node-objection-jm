import { Router, Request as Req, Response as Res } from 'express';
import { User } from '../db/models/user_schema';
import * as passport from 'passport';
import { local } from "../passport/localPass";
import { sendMail } from '../email/resetEmail';
import * as bcrypt from 'bcryptjs';

local(passport);
const router = Router();
/**
 * API USER Routes for my idea app!
 * All routes come from the /user parent route
 *        
 * GET
 *      /forgot         :For when a user forgets their password. Displays the forgot password page
 *      /login          :Displays the login page. Will redirect to /ideas if logged in
 *      /logout         :Log out of the app. Not availble if logged out
 *      /reset/:token   :Find user with the specified token and let them reset their password
 *      /signup         :Display the sign up page so a new user can join the site
 * POST
 *      /forgot         :To finalize the forgot password process. Will send email from here and redirect to /forgot
 *      /login          :Post the log in details and log in
 *      /reset          :Post new password so the user can sign in again
 *      /signup         :Post the sign up details, verify the password, and add the user to the system
 */

router
  .get('/forgot', alreadyLoggedIn, (req: Req, res: Res, next) => {
    const msg = req.flash('message');
    res.render('forgot', {message: msg});
  })
  .post('/forgot', alreadyLoggedIn, (req: Req, res: Res, next) => {
    sendMail(req.body.email, req.hostname);
    req.flash('message', 'An email will be sent shortly.');
    res.redirect('/users/forgot');
  })
  .get('/login', alreadyLoggedIn, (req: Req, res: Res, next) => { 
    const error = req.flash('error');
    res.render('login', {errorMsg: error});
  })
  .post('/login', alreadyLoggedIn, passport.authenticate('local-login', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password.',
    successFlash: 'Welcome to my app of ideas!'
  }), (req: Req, res: Res, next) => {
    res.redirect('/ideas');
  })
  .get('/logout', loggedIn, (req: Req, res: Res, next) => {
    req.logout();
    res.redirect('/');
  })
  .get('/reset/:token', alreadyLoggedIn, (req: Req, res: Res, next) => {
    const errors = req.flash('error');
    User.query().select('email').where({reset_token: req.params.token}).andWhere('token_expire', '>', new Date(Date.now()).toISOString().slice(0,19).replace('T', ' '))
      .then(user => {
        if (!user[0]) {
          throw new Error('Invalid reset token. You may need to have a new email sent.');
        }
        res.render('reset', {user, token: req.params.token, error: errors});
      })
      .catch(err => {
        console.error('ERROR:', err.message);
        req.flash('error', err.message);
        res.redirect('/');
      });
  })
  .post('/reset', alreadyLoggedIn, verifyPass, compareLast, (req: Req, res: Res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 16);
    User.query().update({password: hash}).where({email: req.body.email})
      .then(user => {
        res.redirect('/users/login');
      })
      .catch(err => {
        console.error(err);
        req.flash('error', 'An unexpected error occurred. Please try again later.');
        res.redirect(req.originalUrl);
      })
  })
  .get('/signup', alreadyLoggedIn, (req: Req, res: Res, next) => {
    const error = req.flash('error');
    res.render('signup', {error: error});
  })
  .post('/signup', alreadyLoggedIn, verifyPass, passport.authenticate('local-signup', {
    failureRedirect: '/users/signup',
    failureFlash: 'That email is already taken. Please try again.',
    successFlash: 'Welcome to my app of ideas!'
  }), (req: Req, res: Res, next) => {
    res.redirect('/ideas');
  });

// Middleware function to check if the user is logged in and stop them from going to log in or sign up again
function alreadyLoggedIn(req: Req, res: Res, next) {
  if (req.user) {
    req.flash('signedIn', 'You are already signed in. Please log out to use a different account.');
    res.redirect('/ideas');
  } else {
    next();
  }
};

// Middleware function to let the user sign out, but only if they are signed in
function loggedIn(req: Req, res: Res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
};

function verifyPass(req: Req, res: Res, next) {
  let error = [];
  const pass = req.body.password;
  if (pass !== req.body.confPass) {
    error.push('Passwords do not match. Please try again.');
  }
  if (pass.length < 8) {
    error.push('Your password is not long enough. Please make it longer.');
  }
  if (!/[!@#$%^&*]+?/.test(pass)){
    error.push('Your password does not contain a special character. Please make sure it does.');
  }
  if (!/\d+?/.test(pass)) {
    error.push('Your password does not contain a number. Please make sure it does.');
  }
  if (!/[A-Z]+?/.test(pass)) {
    error.push('Your password does not contain an uppercase character. Please make sure it does.');
  }
  if (!/[a-z]+?/.test(pass)) {
    error.push('Your password does not contain a lowercase character. Please make sure it doesn.');
  }
  if (error.length !== 0){
    req.flash('error', error.toString());
    const token = req.body.token ? req.body.token : '';
    const redirectURL = req.originalUrl + '/' + token;
    return res.redirect(redirectURL);
  }
  next();
};

function compareLast(req: Req, res: Res, next){
  User.query().select('password').where({email: req.body.email})
    .then(user => {
      return bcrypt.compare(req.body.password, user[0].password);
    })
    .then(result => {
      if(result) {
        req.flash('error', 'Your new password cannot be the same as your previous one!');
        return res.redirect(req.originalUrl + '/' + req.body.token);
      }
      next();
    })
    .catch(err => {
      console.log('ERROR:', err);
      req.flash('error', 'An unexpected error has occured. Please try again later.');
      res.redirect('/');
    });
};

export default router;