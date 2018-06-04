//require('dotenv').config({path: '../.env'});
import { config } from 'dotenv';
config();
//const pg = require('pg');
import * as pg from 'pg';
pg.defaults.ssl = true;

export default {
  client: 'pg',
  connection: process.env.DATABASE_URL
}
