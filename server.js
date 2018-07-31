'use strict';

// Load array of notes
const data = require('./db/notes');

const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
// load logger
const myLogger = require('./middleware/logger.js');

// load config file
// const { PORT } = require('./config');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(myLogger);

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
// error handling
app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


// Port to listen for 8080
app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});