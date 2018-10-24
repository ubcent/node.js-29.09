const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  fullName: { type: String },
});

module.exports = mongoose.model('User', userSchema);