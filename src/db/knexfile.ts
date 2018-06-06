import { config } from 'dotenv';
config();
import * as pg from 'pg';
pg.defaults.ssl = true;

export default {
  client: 'pg',
  connection: process.env.DATABASE_URL
}
