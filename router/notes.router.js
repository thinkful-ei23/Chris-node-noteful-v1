'use strict';

const express = require('express');
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);
const router = express.Router();


router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, searchList) => {
    if (err) {
      return next(err);
    }
    res.json(searchList);
  });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  notes.find(id, function (err, item) {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    }
  });
});

// Post to endpoints
router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

// PUT endpoint
router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

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

// DELETE 
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  notes.delete(id, function(err) {
    if (err) {
      return next(err);
    } else {
      res.status(204).end();
    }
    // res.json(item);
  });
});

module.exports = router;