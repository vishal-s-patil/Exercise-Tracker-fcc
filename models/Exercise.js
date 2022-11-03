const mongoose = require('mongoose');

let exerciseSchema = new mongoose.Schema({
    userId: String,
    username: String,
    description: String,
    duration: Number,
    date: Number, // in unix format
})

module.exports = mongoose.model('Exercise', exerciseSchema);