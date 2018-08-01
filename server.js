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
// log requests
app.use(myLogger);
// create static webserver
app.use(express.static('public'));
// Parse and create request.body
app.use(express.json()); 

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, searchList) => {
    if (err) {
      return next(err);
    }
    res.json(searchList);
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;
  notes.find(id, function(err, item) {
    if (err) {
      return next(err);
    }
    res.json(item);
  });
});

// Post to endpoints


// PUT endpoint
app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];
  // compare values
  console.log(req.body);
  console.log(updateObj);

  updateFields.forEach(field => {
    console.log(field);
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

//delete 

// error handling
// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });

app.use(function (req, res, next) {
  let err = new Error('Not Found');
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