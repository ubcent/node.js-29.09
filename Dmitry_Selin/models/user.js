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

UserSchema.methods.checkPassword = function(password, cb) {
  bcrypt.compare(password, this.passwordHash, (err, res) => {
    cb(res ? true : false);
  });
}

module.exports = mongoose.model('User', UserSchema);