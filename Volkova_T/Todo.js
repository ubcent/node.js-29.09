const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todo = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  { collection: 'todos' }
);

module.exports = mongoose.model('todo', todo);
