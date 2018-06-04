
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', table => {
      table.increments('id').primary();
      table.string('email');
      table.unique('email');
      table.string('password');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user')
  ])
};
