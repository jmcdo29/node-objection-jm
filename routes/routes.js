const userRoute = require('./users');
const ideaRoute = require('./ideas');

module.exports = function(app, passport) {

  app.use('/users', userRoute);
  app.use('/ideas', ideaRoute);
  
  app.get('/', (req, res, next) => {
    console.log('REQ.USER:', req.user);
    res.render('home', {loggedIn: req.user ? true : false});
  });
}