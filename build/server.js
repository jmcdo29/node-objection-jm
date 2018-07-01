require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const helmet = require('helmet');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const handlebars = require('express-handlebars');
const sessionConf = require('./utils/sessionConf');
const morgan = require('morgan');
const compression = require('compression');
const routes = require('./routes/routes');
const app = express();

app.use(compression());
app.use(helmet());
app.use(morgan('dev'));
app.engine('handlebars', handlebars({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET));
app.use(sessionConf);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(process.env.PORT, () => {
    console.log('Hello world from port %s!', process.env.PORT);
});

app.on('error', err => {
    console.error(err);
});

module.exports = app;