const http = require('request');
const cheerio = require('cheerio');
const ansi = require("ansi");
const url = 'https://www.rottentomatoes.com/top/';

cursor = ansi(process.stdout);

http(url, (err, res, body) => {
  if(!err && res.statusCode === 200) {
    const $ = cheerio.load(body);

    cursor.bold();
    console.log('\n20 BEST MOVIES OF ALL TIME');
    cursor.reset();

    const movies = $('.best-all-time').next().each((index, element) => {
      if (index % 2 === 0) {
        cursor.bg.grey();
        console.log(`${index + 1}: ${$(element).text()}`);
      } else {
        cursor.bg.red();
        console.log(`${index + 1}: ${$(element).text()}`);
      }
    });

  }
});