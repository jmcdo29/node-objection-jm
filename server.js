require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');

const morgan = require('morgan');

require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(parser.json());
app.use(parser.urlencoded({extended: false}));
app.use(session({secret: process.env.SECRET}));

app.use(passport.initialize());
app.use(passport.session());

app.set('port', process.env.PORT);

require('./routes/routes')(app, passport);

app.listen(app.get('port'), () => {
  console.log('Hello world from port %s!', process.env.PORT);
});