'use strict';

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);


notes.delete(1009, function (err) {
  if (err) {
    console.log(err);
  }
});

// GET Notes with search
notes.filter('cats', (err, list) => {
  if (err) {
    console.error(err);
  }
  console.log(list);
});

// GET Notes by ID
notes.find(1005, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// PUT (Update) Notes by ID
const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah'
};

notes.update(1005, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// const newObj = {
//   title: 'Created object title',
//   content: 'fawgaegawgawrgawrgaerhg'
// };

// // notes.create(newObj, function(err, item) {
// //   if (err) {
// //     console.error(err);
// //   } else {
// //     console.log(item);
// //   }
// // });

// notes.delete(1010, function(err, item) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(item);
//   }
// });