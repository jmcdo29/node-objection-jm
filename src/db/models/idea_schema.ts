import * as Knex from 'knex';
import * as connection from '../knexfile';
import { Model } from 'objection';

const knexConnection = Knex(connection.default);

Model.knex(knexConnection);

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

export{ Idea, Comment };