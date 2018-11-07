const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageShema = new Schema({
  username: { type: String },
  taskText: { type: String },
  isdone: { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', messageShema);