/* const passport = require("passport"); */
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../db/models/user_schema");
const bcrypt = require("bcryptjs");

module.exports = function(passport) {
   passport.use('local-login',
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        console.log("Calling for User object.");
        console.log('Email:', email);
        //console.log('Password:', password);
        //console.log('Done:', done);
        User.query()
          .where({ email: email })
          .limit(1)
          .then(user => {
            console.log("USER:", user[0].email);
            return new Promise(function(resolve, reject){
              bcrypt.compare(password, user[0].password)
                .then(result => {
                  if (result) {
                    resolve(user[0]);
                  } else {
                    reject('The username or password is incorrect.');
                  }
                })
                .catch(err => {
                  reject(err);
                })
            });
          })
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            console.log("ERROR IN LOGIN!");
            console.error(err.message ? err.message : err);
            done(err, null);
          });
      }
    )
  ); 

  passport.use('local-signup',
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      console.log(email);
      User.query()
        .where({email})
        .limit(1)
        .then(user => {
          return new Promise(function(resolve, reject){
            if(user[0]) {
              reject('Email is already taken. Please use a different email or sign in.')
            } else {
              password = bcrypt.hashSync(password,bcrypt.genSaltSync(16));
              return User.query()
                .insert({email, password})
                .select('id')
                .where({email})
                .then(user => {
                  console.log('User:', user);
                  resolve(user);
                });
            }
          });
        })
        .then(newUser => {
          console.log('New User:', newUser);
          console.log('Calling the callback');
          done(null, newUser);
        })
        .catch(err => {
          console.log('ERROR IN SIGNUP!');
          console.error(err.message ? err.message : err);
          done(err, null);
        })
    })
  )

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.query()
      .where({ id })
      .limit(1)
      .then(user => {
        done(null, user[0].id);
      })
      .catch(err => {
        done(err, null);
      })
  })
};
