const mongoose = require('mongoose');

let logsSchema = new mongoose.Schema({
    username: String,
    count: Number,
    log: [{
        description: String,
        duration: Number,
        date: String
    }]
})

module.exports = mongoose.model('Logs', logsSchema);