const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  number: {type: String},
  name: {type: String},
  date: {type: String},
  status: {type: String}
});

module.exports = mongoose.model('tasknews', todoSchema);