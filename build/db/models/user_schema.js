const Knex = require('knex');
const connection = require('../knexfile');
const objection = require('objection');
const knexConnection = Knex(connection.default);
objection.Model.knex(knexConnection);

class User extends objection.Model {
    static get tableName() {
        return 'user';
    }
}

module.exports = User;