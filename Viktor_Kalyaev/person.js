// import the necessary modules
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  // define schema
  const PersonSchema = new Schema({
    name: String,
    age: Number,
    birthday: Date
  });
  mongoose.model('Person', PersonSchema);
};
