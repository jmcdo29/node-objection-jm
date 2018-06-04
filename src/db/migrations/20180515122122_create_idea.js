exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('idea', (table) => {
      table.increments('id').primary();
      table.string('idea');
      table.string('creator');
    })
  ]);
};

exports.down = function (knex, Promise) {
  return promise.all([
    knex.schema.dropTable('idea')
  ]);
};
