const mongoose = require('mongoose');

let User = new mongoose.Schema({
    username: String
})

exports.User = mongoose.model('User', User);