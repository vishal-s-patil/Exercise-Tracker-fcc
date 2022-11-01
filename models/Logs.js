const mongoose = require('mongoose');

let Logs = new mongoose.Schema({
    username: String,
    count: 1,
    log: [{
        description: String,
        duration: Number,
        date: String
    }]
})

exports.Logs = mongoose.model('Logs', Logs);