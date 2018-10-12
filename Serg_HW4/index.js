const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const site = 'http://lenta.ru';
const pattern = /<\/time>(?!<\/div>)(.*?)<\/a>/gm;

const app = express();

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', {title: 'Новости'});
});

app.post('/news', async (req, res) => {
  let counts = Number.parseInt(req.body.counts);
  counts = Number.isInteger(counts) ? counts : 10;
  counts = (counts < 1 || counts > 10) ? 10 : counts;

  const getNews = await parseNews(pattern);

  if (getNews.length !== 0) {
    res.render('news', {title: 'Новости', getNews, counts});
  } else {
    res.send('Новостей нет');
  }
});

function requestNews(site) {
  return new Promise((resolve, reject) => {
    request(site, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function parseNews(pattern) {
  let matches;
  const newsArray = [];
  const news = await requestNews(site);

  while ((matches = pattern.exec(news)) !== null) {
    newsArray.push(matches[1].replace(/&nbsp;/g, ' '));
  }
  return newsArray;
}

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
