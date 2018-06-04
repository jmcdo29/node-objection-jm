//const Knex = require('knex');
import * as Knex from 'knex';
//const connection = require('../knexfile');
import * as connection from '../knexfile';
import { Model } from 'objection';

const knexConnection = Knex(connection.default);

Model.knex(knexConnection);

class User extends Model {
  readonly id!: number;
  email: string;
  password: string;
  reset_token: string;
  token_expire: string;

  static get tableName() {
    return 'user';
  }
}

export  { User };