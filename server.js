'use strict';

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const app = express();
const router = require('./router/notes.router.js');
const morgan = require('morgan');
// load config file
const { PORT } = require('./config');


// this logs time and every request
app.use(morgan('common'));
// create static webserver
app.use(express.static('public'));
// Parse and create request.body
app.use(express.json()); 
// goes to notes.router starts there
app.use('/api/notes', router);


console.log('Hello Noteful!');
// if an error occurs in notes.router sends err hereee
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
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});