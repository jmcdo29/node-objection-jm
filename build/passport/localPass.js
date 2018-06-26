const passport_local = require("passport-local");
const User = require("../db/models/user_schema");
const bcrypt = require("bcryptjs");

function local(passport) {
    passport.use('local-login', new passport_local.Strategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, function (req, email, password, done) {
        User.query()
            .where({ email: email })
            .limit(1)
            .then(user => {
            if (!user[0]) {
                throw new Error('No user found. Please check your user name, or sign up.');
            }
            return new Promise(function (resolve, reject) {
                bcrypt.compare(password, user[0].password)
                    .then(result => {
                    if (result) {
                        resolve(user[0]);
                    }
                    else {
                        reject('The username or password is incorrect.');
                    }
                })
                    .catch(err => {
                    reject(err);
                });
            });
        })
            .then(user => {
            done(null, user);
        })
            .catch(err => {
            console.log("ERROR IN LOGIN!");
            console.error(err.message ? err.message : err);
            done(null, null, err.message);
        });
    }));
    passport.use('local-signup', new passport_local.Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        User.query()
            .where({ email })
            .limit(1)
            .then(user => {
            return new Promise(function (resolve, reject) {
                if (user[0]) {
                    reject('Email is already taken. Please use a different email or sign in.');
                }
                else {
                    password = bcrypt.hashSync(password, 16);
                    return User.query()
                        .insert({ email, password })
                        .select('id')
                        .where({ email })
                        .then(user => {
                        resolve(user);
                    });
                }
            });
        })
            .then(newUser => {
            done(null, newUser);
        })
            .catch(err => {
            console.log('ERROR IN SIGNUP!');
            console.error(err.message ? err.message : err);
            done(null, null, err);
        });
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.query()
            .where({ id })
            .limit(1)
            .then(user => {
            done(null, user[0].id);
        })
            .catch(err => {
            done(err, null);
        });
    });
}

module.exports = local;