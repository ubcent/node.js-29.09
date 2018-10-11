const path = require('path');
const express = require('express');
const request = require('request');

const site = 'http://lenta.ru';
const pattern = /<\/time>(?!<\/div>)(.*?)<\/a>/gm;
const app = express();

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

function renderIndex(site) {
  request(site, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      parse(body, pattern);
    }
  });
}

function parse(body, pattern) {
  let matches;
  const matchesArray = [];

  while ((matches = pattern.exec(body)) !== null) {
    matchesArray.push(matches[1].replace(/&nbsp;/g, ' '));
  }

  app.get('/', (req, res) => {
    res.render('index', {title: 'Новости', matchesArray});
  });
}

renderIndex(site);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
