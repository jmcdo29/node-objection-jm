require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const morgan = require('morgan');

const sessionStore = new session.MemoryStore;

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(parser.json());
app.use(parser.urlencoded({extended: false}));
app.use(cookieParser(process.env.SECRET));
app.use(session({
  secret: process.env.SECRET,
  cookie: {maxAge: 60000},
  store: sessionStore,
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes')(app, passport);

app.listen(process.env.PORT, () => {
  console.log('Hello world from port %s!', process.env.PORT);
});

app.on('listen', () => {
  console.log('The app is listening.');
});

app.on('error', err => {
  console.error(err);
});