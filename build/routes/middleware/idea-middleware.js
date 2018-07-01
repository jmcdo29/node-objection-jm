function authenticated(req, res, next) {
  //console.log(req);
  if (req.user) {
      next();
  }
  else {
      res.redirect('/');
  }
}

module.exports = {
  authenticated
};