const session = require("express-session");
const KnexSessionStore = require('connect-session-knex')(session);
const dbConf = require("../db/knexfile");
const Knex = require("knex");
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

module.exports = mySession;