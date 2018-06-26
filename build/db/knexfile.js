"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
const pg = require("pg");
pg.defaults.ssl = true;
exports.default = {
    client: 'pg',
    connection: process.env.DATABASE_URL
};
