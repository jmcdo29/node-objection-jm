const Knex = require('knex');
const connection = require('../knexfile');
const { Model } = require('objection');

const knexConnection = Knex(connection);

class Idea extends Model {
  static get tableName () {
    return 'idea';
  }

  static get relationMappings () {
    return {
      comments: {
        relation: Model.HasManyRelation,
        modelClass: Comment,
        join: {
          from: 'idea.id',
          to: 'comment.idea_id'
        }
      }
    }
  }
}

module.exports = { Idea };