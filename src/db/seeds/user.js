const bcrypt = require('bcryptjs');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {email: 'jmcdo29@gmail.com', password: bcrypt.hashSync('password', 16)},
        {email: 'jmcdo29+trial1@gmail.com', password: bcrypt.hashSync('password1', 16)},
        {email: 'jmcdo29+trial2@gmail.com', password: bcrypt.hashSync('password2', 16)}
      ]);
    });
};
