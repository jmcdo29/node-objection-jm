
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('comment', table => {
      table.increments('id').primary();
      table.string('comment');
      table.string('creator');
      table.integer('idea_id').references('id').inTable('idea');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('comment')
  ]);
};
