const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Task = new Schema({
    name: String,
    status: {
        type: Boolean,
        default: false
    },
    created: Date
});

module.exports.Task = mongoose.model('Task', Task);