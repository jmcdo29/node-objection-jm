// Middleware function to check if the user is logged in and stop them from going to log in or sign up again
function alreadyLoggedIn(req, res, next) {
  if (req.user) {
      req.flash('signedIn', 'You are already signed in. Please log out to use a different account.');
      res.redirect('/ideas');
  }
  else {
      next();
  }
};

// Middleware function to let the user sign out, but only if they are signed in
function loggedIn(req, res, next) {
  if (req.user) {
      next();
  }
  else {
      res.redirect('/');
  }
};

function verifyPass(req, res, next) {
  let error = [];
  const pass = req.body.password;
  if (pass !== req.body.confPass) {
      error.push('Passwords do not match. Please try again.');
  }
  if (pass.length < 8) {
      error.push('Your password is not long enough. Please make it longer.');
  }
  if (!/[!@#$%^&*]+?/.test(pass)) {
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
  if (error.length !== 0) {
      req.flash('error', error.toString());
      const token = req.body.token ? req.body.token : '';
      const redirectURL = req.originalUrl + '/' + token;
      return res.redirect(redirectURL);
  }
  next();
};
function compareLast(req, res, next) {
  User.query().select('password').where({ email: req.body.email })
      .then(user => {
      return bcrypt.compare(req.body.password, user[0].password);
  })
      .then(result => {
      if (result) {
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

module.exports = {
  alreadyLoggedIn,
  loggedIn,
  verifyPass,
  compareLast
}