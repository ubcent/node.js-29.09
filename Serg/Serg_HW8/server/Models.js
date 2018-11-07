const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
  login: {type: String, required: true},
  name: {type: String, required: true},
  status: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Todo', ToDoSchema);
