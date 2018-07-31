// 'use strict';

// const express = require('express');
// const data = require('./db/modules');
// const router = express.Router();

// router.get('/api/notes', (req, res) => {
//   const query = req.query;
//   let searchList = data;
//   if (query.searchTerm) {
//     searchList = searchList.filter(item => item.title.includes(query.searchTerm));
//   }
//   res.json(searchList);
// });

// router.get('/api/notes/:id', (req, res) => {
//   const id = req.params.id;
//   const item = data.find(item => item.id === Number(id));
//   res.json(item);
// });

// module.exports = router;