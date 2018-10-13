const request = require('request');
const cheerio = require('cheerio');

const url = 'https://russian.rt.com/russia';

request(url, (err, reponse, body) => {
    if(!err && reponse.statusCode === 200) {
        const $ = cheerio.load(body);
        $('.card__heading a').each((idx, item) => {
            const el = $(item).text();
            console.log((idx + 1 ) + '.', el)
        })
    }
})
