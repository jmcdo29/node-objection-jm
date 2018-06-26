
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('idea').del()
    .then(function () {
      // Inserts seed entries
      return knex('idea').insert([
        {creator: 'Jay', idea: 'Objection Database'},
        {creator: 'Jay', idea: 'Using Knex'},
        {creator: 'Jay', idea: 'Online Calculator'},
        {creator: 'Jay', idea: 'ZeldaPlay Character Tracker'}
      ]);
    });
};
