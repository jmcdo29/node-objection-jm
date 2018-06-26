import * as session from 'express-session';
const KnexSessionStore = require('connect-session-knex')(session);
import * as dbConf from '../db/knexfile';
import * as Knex from 'knex';

const knex = Knex(dbConf.default);

const store = new KnexSessionStore({
  knex: knex,
  tablename: 'sessions'
});

const mySession = session({
  secret: process.env.SECRET,
  cookie: { maxAge: 60000 },
  store: store,
  saveUninitialized: true,
  resave: true
});

export {mySession};