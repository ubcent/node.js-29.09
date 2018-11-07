const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  username: {type: String},
  password: {type: String},
  lastname: {type: String}
});

module.exports = mongoose.model('User', usersSchema);