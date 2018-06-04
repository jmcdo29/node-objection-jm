
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('user', table => {
      table.string('reset_token');
      table.time('token_expire');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('user', table => {
      table.dropColumn('reset_token');
      table.dropColumn('token_expire');
    })
  ]);
};
