const mongoose = require('mongoose');

let Exercise = new mongoose.Schema({
    username: String,
    description: String,
    duration: Number,
    date: String,
})

exports.Exercise = mongoose.model('Exercise', Exercise);