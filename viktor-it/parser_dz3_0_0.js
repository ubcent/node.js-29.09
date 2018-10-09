const request = require('request');
const cheerio = require('cheerio');

const url = 'http://uk.ufc.com/RANKINGS';
console.log('Легковесы в UFC:');
request(url, (err, response, body) => {
  if(!err && response.statusCode === 200){
    const $ = cheerio.load(body);
    const fighterList = $($('.ranking-list.tall')[4]).find('.name-column a');
    fighterList.each((idx, item) => {
    	console.log((idx+1) + '.', $(item).text().trim());
    })
   }
});