const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: String
})

module.exports = mongoose.model('User', userSchema);