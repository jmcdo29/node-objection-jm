const Knex = require('knex');
const connection = require('../knexfile');
const { Model } = require('objection');

const knexConnection = Knex(connection);

class Comment extends Model {
  static get tableName () {
    return 'comment';
  }

  static get relationMappings () {
    return {
      idea: {
        relation: Model.BelongsToOneRelation,
        modelClass: Idea,
        join: {
          from: 'comment.idea_id',
          to: 'idea.id'
        }
      }
    }
  }
}

export { Comment };