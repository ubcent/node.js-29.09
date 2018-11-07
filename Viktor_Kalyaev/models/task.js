const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  desc: { type: String },
});

module.exports = mongoose.model('Task', userSchema);