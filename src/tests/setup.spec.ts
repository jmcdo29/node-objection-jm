import 'mocha';

const app = require('../app/server')();

export const request = require('supertest')(app);

import * as chai from 'chai';
export { chai };