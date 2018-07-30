'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

app.get('/api/notes', (req, res) => {
  const query = req.query;
  let searchList = data;
  if (query.searchTerm) {
    searchList = searchList.filter(item => item.title.includes(query.searchTerm));
  }
  res.json(searchList);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const item = data.find(item => item.id === Number(id));
  res.json(item);
});