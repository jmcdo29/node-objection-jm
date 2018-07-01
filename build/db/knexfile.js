require('dotenv').config();
const pg = require('pg');
pg.defaults.ssl = true;
exports.default = {
    client: 'pg',
    connection: process.env.DATABASE_URL
};
