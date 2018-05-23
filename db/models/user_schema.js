const Knex = require('knex');
const connection = require('../knexfile');
const { Model} = require('objection');

const knexConnection = Knex(connection);

Model.knex(knexConnection);

class User extends Model {
  static get tableName() {
    return 'user';
  }
}

module.exports = { User };