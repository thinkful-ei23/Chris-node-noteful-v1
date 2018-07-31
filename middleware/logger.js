'use strict';

const myLogger = function(req, res, next ) {
  const newDate = new Date();
  console.log(`${newDate.toLocaleDateString()} ${newDate.toLocaleTimeString()} ${req.method} ${req.url}`);  
  next();
};

module.exports = myLogger;