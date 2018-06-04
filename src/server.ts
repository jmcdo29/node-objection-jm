import {config} from 'dotenv';
import * as express from 'express';
import {json, urlencoded}  from "body-parser";
import * as helmet from 'helmet';
import * as session from 'express-session';
const flash = require('express-flash');
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

import * as morgan from 'morgan';

import routes from './routes/routes';

const sessionStore = new session.MemoryStore;

config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(json());
app.use(urlencoded({extended: false}));
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

routes(app, passport);

app.listen(process.env.PORT, () => {
  console.log('Hello world from port %s!', process.env.PORT);
});

app.on('error', err => {
  console.error(err);
});