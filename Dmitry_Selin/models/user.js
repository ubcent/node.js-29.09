const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
  },
  passwordHash: {
    type: String,
    required: true
  },
});

UserSchema.methods.checkPassword = async function(password) {
  const correct = await bcrypt.compare(password, this.passwordHash);
  return correct;
}

module.exports = mongoose.model('User', UserSchema);