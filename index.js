const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
let Logs = require('./models/Logs.js');
let Exercise = require('./models/Exercise.js');
let User = require('./models/User.js');
require('dotenv').config();
const connection = require('./connection.js');


app.use(cors());
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connection.on('error', (err) => {
	console.log(err);
	res.status(401).json({ error: 'connection error' });
})
connection.once('open', () => {
	console.log('db connected');
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html')
});

// to store the user 
app.post('/api/users', async (req, res) => {
	let username = req.body.username;

	let user = new User({
		username: username
	})

	await user.save();

	res.json({ username: username, _id: user._id });
})

// to list the users 
app.get('/api/users', async (req, res) => {
	allusers = await User.find({});
	res.json(allusers);
})

// add exercise data to db
app.post('/api/users/:_id/exercises', async (req, res) => {
	const { description, duration } = req.body;
	const _id = req.params._id;
	let { date } = req.body;

	if (date.length == 0) {
		let d = new Date();
		date = d.toDateString();
	}

	let user = await User.findById({ _id }).clone().catch(function (err) { console.log(err) });

	res.json({
		_id,
		username: user.username,
		date,
		duration,
		description
	})
});







const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})
