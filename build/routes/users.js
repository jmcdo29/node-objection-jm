const express = require('express');
const User = require('../db/models/user_schema');
const passport = require('passport');
const localPass = require('../passport/localPass')(passport);
const resetEmail = require('../email/resetEmail');
const bcrypt = require('bcryptjs');
const middleware = require('./middleware/login-middleware');

const alreadyLoggedIn = middleware.alreadyLoggedIn;
const loggedIn = middleware.loggedIn;
const verifyPass = middleware.verifyPass;
const compareLast = middleware.compareLast;

const router = express.Router();
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
    .get('/forgot', alreadyLoggedIn, (req, res, next) => {
    const msg = req.flash('message');
    res.render('forgot', { message: msg });
})
    .post('/forgot', alreadyLoggedIn, (req, res, next) => {
    resetEmail.sendMail(req.body.email, req.hostname);
    req.flash('message', 'An email will be sent shortly.');
    res.redirect('/users/forgot');
})
    .get('/login', alreadyLoggedIn, (req, res, next) => {
    const error = req.flash('error');
    res.render('login', { errorMsg: error });
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
})
    .get('/reset/:token', alreadyLoggedIn, (req, res, next) => {
    const errors = req.flash('error');
    User.query().select('email').where({ reset_token: req.params.token }).andWhere('token_expire', '>', new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' '))
        .then(user => {
        if (!user[0]) {
            throw new Error('Invalid reset token. You may need to have a new email sent.');
        }
        res.render('reset', { user, token: req.params.token, error: errors });
    })
        .catch(err => {
        console.error('ERROR:', err.message);
        req.flash('error', err.message);
        res.redirect('/');
    });
})
    .post('/reset', alreadyLoggedIn, verifyPass, compareLast, (req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 16);
    User.query().update({ password: hash }).where({ email: req.body.email })
        .then(user => {
        res.redirect('/users/login');
    })
        .catch(err => {
        console.error(err);
        req.flash('error', 'An unexpected error occurred. Please try again later.');
        res.redirect(req.originalUrl);
    });
})
    .get('/signup', alreadyLoggedIn, (req, res, next) => {
    const error = req.flash('error');
    res.render('signup', { error: error });
})
    .post('/signup', alreadyLoggedIn, verifyPass, passport.authenticate('local-signup', {
    failureRedirect: '/users/signup',
    failureFlash: 'That email is already taken. Please try again.',
    successFlash: 'Welcome to my app of ideas!'
}), (req, res, next) => {
    res.redirect('/ideas');
});

module.exports = router;