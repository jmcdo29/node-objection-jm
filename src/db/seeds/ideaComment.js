
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('idea').select('id'),
    knex('comment').select('id')
  ])
    .then(allIds => {
      return Promise.all([
        knex('comment').where({id: allIds[1][0].id}).update({idea_id: allIds[0][0].id}),
        knex('comment').where({id: allIds[1][1].id}).update({idea_id: allIds[0][0].id}),
        knex('comment').where({id: allIds[1][2].id}).update({idea_id: allIds[0][1].id}),
        knex('comment').where({id: allIds[1][3].id}).update({idea_id: allIds[0][2].id}),
        knex('comment').where({id: allIds[1][4].id}).update({idea_id: allIds[0][3].id}),
        knex('comment').where({id: allIds[1][5].id}).update({idea_id: allIds[0][2].id}),
        knex('comment').where({id: allIds[1][6].id}).update({idea_id: allIds[0][1].id}),
      ])
    });
};
