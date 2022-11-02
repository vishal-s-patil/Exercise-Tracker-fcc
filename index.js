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
	else {
		let d = new Date(date);
		date = d.toDateString();
	}

	let user = await User.findById({ _id }).clone().catch(function (err) { console.log(err) });

	let exercise = new Exercise({
		user_id: _id,
		username: user.username,
		date,
		duration,
		description
	});
	await exercise.save();

	res.json({
		_id,
		username: user.username,
		date,
		duration,
		description
	});
});

app.get('/api/users/:_id/logs', async (req, res) => {
	let _id = req.params._id;
	const { from, to, limit } = req.query;
	let exercises = await Exercise.find({ user_id: _id });

	let username;
	if (exercises.length != 0) {
		username = exercises[0].username;
	}

	let logs = [];
	let l = limit;
	for (let index = 0; index < exercises.length; index++) {
		const exercise = exercises[index];

		if (l != undefined) {
			l -= 1;
			if (l < 0)
				break;
		}

		if (from == undefined && to == undefined) {
			logs.push({
				description: exercise.description,
				duration: exercise.duration,
				date: exercise.date
			})
		}
		else {
			if (from != undefined && to != undefined) {
				if (((new Date(exercise.date).getTime()) >= (new Date(from).getTime())) && ((new Date(exercise.date).getTime()) <= (new Date(to).getTime()))) {
					logs.push({
						description: exercise.description,
						duration: exercise.duration,
						date: exercise.date
					})
				}
			}
			else if (from != undefined && (new Date(exercise.date).getTime()) >= (new Date(from).getTime())) {
				logs.push({
					description: exercise.description,
					duration: exercise.duration,
					date: exercise.date
				})
			}
			else if (to != undefined && (new Date(exercise.date).getTime()) <= (new Date(to).getTime())) {
				logs.push({
					description: exercise.description,
					duration: exercise.duration,
					date: exercise.date
				})
			}
		}
	}

	res.json({
		_id,
		username,
		count: exercises.length,
		logs
	});
});





const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})
