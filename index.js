const express = require('express')
const app = express()
const cors = require('cors')
let Logs = require('./models/Logs.js');
let Exercise = require('./models/Exercise.js');
let User = require('./models/User.js');
const connection = require('./connection.js');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
	res.json({ user: 'user' });
})







const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})
