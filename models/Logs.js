const mongoose = require('mongoose');

let logsSchema = new mongoose.Schema({
    "description": String,
    "duration": Number,
    "date": Date
})

module.exports = mongoose.model('Logs', logsSchema);