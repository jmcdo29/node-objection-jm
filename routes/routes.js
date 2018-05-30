const userRoute = require('./users');
const ideaRoute = require('./ideas');

module.exports = function(app, passport) {

  app.use('/users', userRoute);
  app.use('/ideas', ideaRoute);
  
  app.get('/', (req, res, next) => {
    const error = req.flash('error');
    res.render('home', {loggedIn: req.user ? true : false, error: error});
  });
}