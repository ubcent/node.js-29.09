const mongoose = require('mongoose')

const Schema = mongoose.Schema

const lineSchema = new Schema({
  title: { type: String },
  text: { type: String },
  status: { type: Boolean, default: false },
})

module.exports = mongoose.model('notes', lineSchema)

