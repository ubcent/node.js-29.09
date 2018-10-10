const request = require('request');
const cheer = require('cheerio');
const log = console.log;

request('https://tjournal.ru/', (err, resp, body) => {
  if (!err && resp.statusCode == 200) {
    const $ = cheer.load(body);
    $('.b-article h2').each(function (i, elem) {
      let cols = $(this).find('span')
      console.dir(cols.text())
    })
    process.exit()
  } else { log(`Request down`) }
})