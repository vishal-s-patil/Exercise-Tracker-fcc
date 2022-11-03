const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config();
let Exercise = require('./models/Exercise.js');
let User = require('./models/User.js');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html')
});

// to store the user 
app.post('/api/users', async (req, res) => {
	const username = req.body.username;

	let user = await User.findOne({ username });

	if (!user) {
		user = new User({ username: username });
		await user.save();

		res.status(200).json({
			username,
			_id: user._id
		});
	} else {
		res.status(400).send("This user already exists.");
	}
})

// to list the users 
app.get('/api/users', async (req, res) => {
	User.find()
		.then((result) => res.status(200).json(result))
		.catch((error) => res.status(400).send(error));
})

// this function is because different time zones 
const getDate = (date) => {
	if (!date) {
		return new Date().toDateString();
	}
	const correctDate = new Date();
	const dateString = date.split("-");
	correctDate.setFullYear(dateString[0]);
	correctDate.setDate(dateString[2]);
	correctDate.setMonth(dateString[1] - 1);

	return correctDate.toDateString();
};

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

		let username = user.username;

		Exercise.find({ userId }, (err, exercises) => {
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
			var log = exercises.filter((session) => {
				let sessionDate = new Date(session.date).getTime();
				return sessionDate >= fromDate && sessionDate <= toDate;
			})

			if (limit) {
				log = log.slice(0, limit);
			}
			if (log.length == 0) {
				res.json({
					_id: userId,
					username,
					count: log.length,
					log: []
				})
			}
			res.json({
				_id: userId,
				username,
				count: log.length,
				log
			})
		})
	})
});


const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})
