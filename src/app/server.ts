import {config} from 'dotenv';
import * as express from 'express';
import {json, urlencoded}  from "body-parser";
import * as helmet from 'helmet';
import flash = require('express-flash');
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as handlebars from "express-handlebars";
import { mySession as session } from './utils/sessionConf';
import * as morgan from 'morgan';
import * as compression from 'compression';

import routes from './routes/routes';

config();

const app = express();

app.use(compression());
app.use(helmet());
app.use(morgan('dev'));
app.engine('handlebars', handlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(json());
app.use(urlencoded({extended: false}));
app.use(cookieParser(process.env.SECRET));
app.use(session);
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

export { app };