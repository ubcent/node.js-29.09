const mongoose = require('mongoose');
const Shema = mongoose.Schema;

const animalSchema = new Shema({
  name: { type: String, default: 'Rat', required: true }
});

module.exports = mongoose.model('Animal', animalSchema);