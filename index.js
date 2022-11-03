const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config();
let Exercise = require('./models/Exercise.js');
let User = require('./models/User.js');
const connection = require('./connection.js');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'))

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

	try {
		let user = new User({
			username: username
		})

		await user.save();

		res.json({ username: username, _id: user._id });
	}
	catch (e) {
		res.status(400).send(e);
	}
})

// to list the users 
app.get('/api/users', async (req, res) => {
	try {
		allusers = await User.find({});
		res.json(allusers);
	}
	catch (e) {
		res.status(400).send(e);
	}
})

// add exercise data to db
app.post('/api/users/:_id/exercises', async (req, res) => {
	const { description, duration } = req.body;
	const userId = req.params._id;
	let { date } = req.body;

	try {
		// date processing 
		if (date.length == 0) {
			let d = new Date()
			date = d.toDateString();
		}
		else {
			let d = new Date(date);
			date = d.toDateString();
		}

		let user = await User.findById({ _id: userId }).clone().catch(function (err) { console.log(err) });
		if (!user) {
			res.json({ error: "wrong id" });
			return;
		}
		let exercise = new Exercise({
			userId,
			username: user.username,
			date,
			duration: parseInt(duration),
			description
		});
		await exercise.save();

		res.json({
			_id: userId,
			username: user.username,
			date: (new Date(date)).toDateString(),
			duration: parseInt(duration),
			description
		});
	}
	catch (e) {
		res.status(400).send(e);
	}
});

app.get('/api/users/:_id/logs', (req, res) => {
	const { from, to } = req.query;
	let { limit } = req.query;
	let userId = req.params._id;

	User.findById({ _id: userId }, (err, user) => {
		if (err) {
			console.log(err);
			res.status(400).json({ error: 'error' });
		}
		else {
			let username = user.username;

			Exercise.find({ userId }, (err, exercises) => {
				console.log(exercises.length);
				if (err) {
					console.log(err);
					res.status(400).json({ error: 'error' });
				}
				else {
					let fromDate = new Date(0);
					let toDate = new Date();

					if (from) {
						fromDate = new Date(req.query.from);
					}

					if (to) {
						toDate = new Date(req.query.to);
					}

					fromDate = fromDate.getTime();
					toDate = toDate.getTime();
					console.log(fromDate, toDate);
					var log = exercises.filter((session) => {
						let sessionDate = new Date(session.date).getTime();
						return sessionDate >= fromDate && sessionDate <= toDate;
					})
				}

				if (limit) {
					log = log.slice(0, limit);
				}
				res.json({
					_id: userId,
					username,
					count: log.length,
					log
				})
			})
		}
	})
});


const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})
