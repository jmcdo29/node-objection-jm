const express = require('express');
const parser = require('body-parser');

const ideas = require('./routes/ideas');

require('dotenv').config();

const app = express();

app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

app.set('port', process.env.PORT);

app.use('/ideas', ideas);

app.listen(app.get('port'), () => {
  console.log('Hello world!');
});