// import the necessary modules
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  // define schema
  const TodoSchema = new Schema({
    isdone: Boolean,
    name: String,
  });
  mongoose.model('Todo', TodoSchema);
};
