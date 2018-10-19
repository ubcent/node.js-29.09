const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    email: String,
    password: String,
    data: {
        birthday: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: 'active',
            enum: ['active', 'unactive']
        },
        mix: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    }
});

module.exports = mongoose.model('User', User);