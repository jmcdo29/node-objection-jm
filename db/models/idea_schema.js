const Knex = require('knex');
const connection = require('../knexfile');
const { Model } = require('objection');

const knexConnection = Knex(connection);

Model.knex(knexConnection);

class Idea extends Model {
  static get tableName () {
    return 'idea';
  }

  static get relationMappings () {
    const { Comment } = require('./comment_schema');

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