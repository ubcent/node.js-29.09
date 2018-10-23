const express = require('express');
const multer = require('multer');
const upload = multer();
const mongoose = require('mongoose');
const path = require('path');
const consolidate = require('consolidate');

// Database setup.

mongoose.connect('mongodb://127.0.0.1:27017/missions', {useNewUrlParser: true});
mongoose.connection.on('open', function (err) {
	if (err) {
		console.error( 'connection error:');
	}
	console.log('Connected to database.');
});

const missionSchema = new mongoose.Schema({
	name: String,
	text: String,
	reward: String,
	progress: Boolean,
});

const Mission = mongoose.model('Mission', missionSchema);

const missions = {
	mission1: new Mission({
		name: 'Kill Ogre', 
		text: 'Ogre is on the XXX hills', 
		reward: 'Thank you',
		progress: false,
	}),
	mission2: new Mission({
		name: 'Collect herbs', 
		text: '5 weeds, 3 sunflowers', 
		reward: '500 gold',
		progress: false,
	}),
	mission3: new Mission({
		name: 'Negotioations', 
		text: 'Force those guys to leave my tavern. Come talk to me for details', 
		reward: '100 gold',
		progress: false,
	}),
};
// Используйте, чтобы заполнить базу, если она пуста. Для тестов.

/*
for (var quest in missions) {
	missions[quest].save(function (err, data) {
		if (err) {
			return console.error(err);
		}
		console.log('Added: ' + data);
	});
}
*/

// Server.

const app = express();

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'database'));

app.use(express.static(path.resolve(__dirname, 'database/files')));

// Функция для парса строки.

function parseRequest (string) {
	let array = string.split(', ');
	let object = {};
	for (let i = 0; i < array.length; i++) {
		if (i % 2 == 0) {
			continue;
		} else {
			object[array[i-1]] = array[i];
		}
	}
	return object;
}

// Добавить

app.post('/add', upload.any(), (req, res) => {
	let query = parseRequest(req.body.add);
	let newDoc = new Mission(query);
	newDoc.save((err, data) => {
		res.render('database', {
			output: data,
		});
	});
})

// Поиск по базе/получение

app.get('/search', upload.any(), (req, res) => {
	let prop = req.url.slice(req.url.indexOf('?') + 8, req.url.indexOf('&'));
	let value = req.url.slice(req.url.indexOf('&') + 13).replace('+', ' ');
	if (prop == 'name') {
		Mission.find({name: value}, (err, data) => {
			res.render('database', {
				output: data,
			});
		});
	};
});

// Получить всю базу

app.get('/show', upload.any(), (req, res) => {
	Mission.find((err, data) => {
		res.render('database', {
			output: data.toString().replace('},{', '}\n{'),
		});
	});
});

// Изменить

app.post('/update', upload.any(), (req, res) => {
	let target = parseRequest(req.body.change);
	let change = parseRequest(req.body['change-to']);
	Mission.updateOne(target, change, (err, data) => {
		res.redirect('/show');
	});
});

// Удалить.

app.post('/delete', upload.any(), (req, res) => {
	let target = parseRequest(req.body.delete);
	Mission.deleteOne(target, (err, data) => {
		res.redirect('/show');
	});
});


app.all('/', (req, res) => {
	res.render('database', {
  		output: 'Here will be results of your queries.',
 		});
})

app.listen(3000);

