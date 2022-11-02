const mongoose = require('mongoose');

let exerciseSchema = new mongoose.Schema({
    userId: String,
    username: String,
    description: String,
    duration: Number,
    date: Date,
})

module.exports = mongoose.model('Exercise', exerciseSchema);