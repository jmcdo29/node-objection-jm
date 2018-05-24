const userRoute = require('./users');
const ideaRoute = require('./ideas');

module.exports = function(app, passport) {

  app.use('/users', userRoute);
  app.use('/ideas', ideaRoute);
  
  app.get('/', (req, res, next) => {
    res.render('home', {loggedIn: req.user ? true : false});
  });
}