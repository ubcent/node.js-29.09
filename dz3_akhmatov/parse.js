const needle = require('needle');
const cheerio = require('cheerio');

needle.get('https://habr.com', function(error, response) {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(response.body);
        const el = $('h2 a');
        el.each((idx, item) => {
            console.log((idx + 1) + '.', $(item).text());
        })
    }
});