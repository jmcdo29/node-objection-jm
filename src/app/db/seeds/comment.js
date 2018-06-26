
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comment').del()
    .then(function () {
      // Inserts seed entries
      return knex('comment').insert([
        {creator: 'Jay', comment: 'This will be useful to learn'},
        {creator: 'Jay', comment: 'Yay! ORMs'},
        {creator: 'Jay', comment: 'Objection needs Knex'},
        {creator: 'Jay', comment: 'Might be fun to make in base node'},
        {creator: 'Jay', comment: 'This will take a long time'},
        {creator: 'Jay', comment: 'Maybe even learn EventEmitters with it'},
        {creator: 'Jay', comment: 'I loved playing with Knex'}
      ]);
    });
};
