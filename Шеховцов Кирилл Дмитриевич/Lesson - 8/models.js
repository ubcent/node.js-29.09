const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Task = new Schema({
    name: String,
    status: {type: Boolean, default: false},
    created: Date
});
const User = new Schema({
    username: String,
    password: String
})

module.exports.Task = mongoose.model('Task', Task);
module.exports.User = mongoose.model('User', User);