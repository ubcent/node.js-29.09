const request = require('request');
const cheerio = require('cheerio');
const readline = require('readline');

console.log('Yo. Enter "-news" to get news list.');
console.log('Enter another english word to translate it on russian');
console.log('Enter "-close" to exit program.');

// 1. Get news List.

const newsUrl = 'https://selector-wixoss.wikia.com/wiki/Blog:Recent_posts';

function getNews () {
	request(newsUrl, (err, res, body) => {
		if (!err && res.statusCode == 200) {
			const $ = cheerio.load(body);
			const newsList = $('.WikiaBlogListingPost');
			console.log(newsList);
			newsList.each((index, item) => {
				let title = $(item).find('.author-details').text().replace(/\s+/g,' ');
				let text = $(item).find('.post-summary > *:not(.read-more)').text().replace(/\s+/g,' ');
				console.log((index + 1) + '. ' + title + '\n');
				console.log('Text: "' + text + '"\n');
			});
		}
	});
}

// 2. Translator.

function translateEnglish (word) {
	let translatorUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181014T134602Z.de036b95f3e5daa3.187e5c36e032c6baa2735dbd6f90a120a9d97b61&text='
	+ word + '&lang=en-ru';
	request(translatorUrl, (err, res, body) => {
		if (!err && res.statusCode == 200) {
			let translation = JSON.parse(body);
			console.log('Translation: ' + translation.text);
		};
	});
}

// UI.

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.on('line', (line) => {
	if (line == '-close') {
		console.log('Bye-bye!');
		rl.close();
	} else if (line == '-news') {
		getNews();
	} else {
		translateEnglish(line);
	}
})

