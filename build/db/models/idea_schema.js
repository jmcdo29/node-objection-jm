const Knex = require("knex");
const connection = require("../knexfile");
const objection = require("objection");
const knexConnection = Knex(connection.default);
objection.Model.knex(knexConnection);

class Comment extends objection.Model {
    static get tableName() {
        return 'comment';
    }
    static get relationMappings() {
        return {
            idea: {
                relation: objection.Model.BelongsToOneRelation,
                modelClass: Idea,
                join: {
                    from: 'comment.idea_id',
                    to: 'idea.id'
                }
            }
        };
    }
}

module.exports = Comment;
class Idea extends objection.Model {
    static get tableName() {
        return 'idea';
    }
    static get relationMappings() {
        return {
            comments: {
                relation: objection.Model.HasManyRelation,
                modelClass: Comment,
                join: {
                    from: 'idea.id',
                    to: 'comment.idea_id'
                }
            }
        };
    }
}

module.exports = Idea;
