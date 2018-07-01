const users = require('./users');
const ideas = require('./ideas');

module.exports = function (app, passport) {
    app.use('/users', users);
    app.use('/ideas', ideas);
    app.get('/', (req, res, next) => {
        const error = req.flash('error');
        res.render('home', { loggedIn: req.user ? true : false, error: error });
    });
}