const needle = require ('needle');
const cheerio = require ('cheerio');


const url = 'https://www.kommersant.ru';

needle.get(url, function(error, response) {
    
    if (!error && response.statusCode == 200) {
    const $ = cheerio.load(response.body);
    const newsList = $('.time');
    newsList.each((idx, item) => {
        console.log((idx + 1) + '.', $(item).next().text());
    })
  }
});