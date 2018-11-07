const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const multer = require('multer');
const upload = multer();
const consolidate = require('consolidate');
const cookieSession = require('cookie-session');
const path = require('path');

const app = express();

// Site's news parsing.

const wixossUrl = 'https://selector-wixoss.wikia.com/wiki/Blog:Recent_posts';
const surrenderUrl = 'http://www.surrenderat20.net/';
var html = '';

function getNewsWixoss (number, after) {
	request(wixossUrl, (err, res, body) => {
		if (!err && res.statusCode == 200) {
			const $ = cheerio.load(body);
			const newsList = $('.WikiaBlogListingPost');
			var result = '';
			for (let i = 0, e = 0; i < newsList.length && e < number; i++) {
				let date = $(newsList[i]).find('.author-details span').text();
				date = date.slice(0, date.indexOf(',') + 6);
				if (Date.parse(after) < Date.parse(dateTransform(date))) {
					let title = $(newsList[i]).find('.author-details').text().replace(/\s+/g,' ');
					let text = $(newsList[i]).find('.post-summary > *:not(.read-more)').text().replace(/\s+/g,' ');
					result += `${(e + 1)}. ${title} \n`;
					result += `Text: "${text}"\n`;
					e++;
				}
			}
			html = result;
		}
	});
};

function getNewsSurrender (number, after) {
	request(surrenderUrl, (err, res, body) => {
		if (!err && res.statusCode == 200) {
			const $ = cheerio.load(body);
			const newsList = $('.post-outer > .post');
			var result = '';
			for (let i = 0, e = 0; i < newsList.length && e < number; i++) {
				let date = $(newsList[i]).find('.news-date .published').text();
				if (Date.parse(after) < Date.parse(dateTransform(date))) {
					let title = $(newsList[i]).find('.post-header').text().replace(/\s+/g,' ');
					let text = $(newsList[i]).find('.news-content').text().replace(/\s+/g,' ').slice(0, -38);
					result += `${(e + 1)}. ${title} \n`;
					result += `Text: "${text}"\n`;
					e++;
				}
			}
			html = result;
		}
	});
};

// transform date into a proper string, that can be parsed by Date.parse().

function dateTransform (date) {
	let transformed = '';
	let stringArr = date.split(' ');
	let day = 0, month = 0, year = 0; 

	switch (stringArr[0]) {
		case 'January':
			month = '01';
			break;
		case 'February':
			month = '02';
			break;
		case 'March':
			month = '03';
			break;
		case 'April':
			month = '04';
			break;
		case 'May':
			month = '05';
			break;
		case 'June':
			month = '06';
			break;
		case 'July':
			month = '07';
			break;
		case 'August':
			month = '08';
			break;
		case 'September':
			month = '09';
			break;
		case 'October':
			month = '10';
			break;
		case 'November':
			month = '11';
			break;
		case 'December':
			month = '12';
			break;
		default:
			break;
	}

	day = stringArr[1].replace(',', '');
	year = stringArr[2];

	return transformed = `${year}-${month}-${day}`;
};

// template
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'form'));

// cookies
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000,
}));

app.get('/', (req, res) => {
	if (req.session.date && req.session.site && req.session.number) {
		res.render('form', {
  		output: 'Result',
  		date: req.session.date,
  		site: req.session.site,
  		number: req.session.number,
 		});
	} else {
		res.render('form', {
  		output: 'Result',
 		});
	};
 	
});

// css
app.use(express.static(path.resolve(__dirname, 'form/files')));

// post requests handler.		
app.post('/form', upload.any(), (req, res) => {
	console.log(`Success getting form.`);
	console.log(req.body);
	req.session.date = req.body.date;
  req.session.site = req.body.site;
  req.session.number = req.body.number;
  console.log(req.session);
	if (req.body.site == 'Wixoss') {
		getNewsWixoss(req.body.number, req.body.date);
	} else if (req.body.site == 'Surrender') {
		getNewsSurrender(req.body.number, req.body.date);
	}
	setTimeout( () => {
		if (req.session.date && req.session.site && req.session.number) {
			res.render('form', {
  			output: html,
  			date: req.session.date,
  			site: req.session.site,
  			number: req.session.number,
 			});
		} else {
			res.render('form', {
  			output: html,
 			});
		};
	}, 1000);
});

app.listen(3000);

