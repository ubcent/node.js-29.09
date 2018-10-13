const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const cookieParser = require('cookie-parser');

const NEWS_CATEGORY_PARAM = 'news_category';
const NEWS_COUNT_PARAM = 'news_count';
const MIN_NEWS_COUNT = 1;
const MAX_NEWS_COUNT = 10;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/news', (req, res) => {
  let newsCategory, newsCount;
  
  // check cookies and GET parameters
  if(req.cookies[NEWS_CATEGORY_PARAM] && req.cookies[NEWS_COUNT_PARAM]){
    newsCategory = req.cookies[NEWS_CATEGORY_PARAM];
    newsCount = req.cookies[NEWS_COUNT_PARAM];
  }
  // if GET parameters are set - overwrite cookie parameters
  if(req.query[NEWS_CATEGORY_PARAM] && req.query[NEWS_COUNT_PARAM]){
    newsCategory = req.query[NEWS_CATEGORY_PARAM];
    newsCount = req.query[NEWS_COUNT_PARAM];
  }

  if(newsCategory && newsCount){
    res.render('newsform', {
      newsCount,
      newsCategoryCountry: newsCategory === 'country',
      newsCategoryRegion: newsCategory === 'region',
    });
  }
  else{
    res.render('newsform', {});
  }
});

app.post('/news', (req, res) => {
  let newsCategory = req.body[NEWS_CATEGORY_PARAM];
  if(!newsCategory){
    res.render('newsform', {
      error: 'Не задана категория новостей',      
    });
    return;
  }
  let newsCount = Number(req.body[NEWS_COUNT_PARAM]);
  if(isNaN(newsCount) || newsCount < MIN_NEWS_COUNT || newsCount > MAX_NEWS_COUNT){
    res.render('newsform', {
        error: 'Количество новостей задано некорректно',
    });
    return;
  }

  request('https://yandex.ru', (err, response, body) => {
    if(!err && response.statusCode === 200) {
        news = parseNews(body, newsCategory);
        res.cookie(NEWS_CATEGORY_PARAM, newsCategory);
        res.cookie(NEWS_COUNT_PARAM, newsCount);
        res.render('newsform', {
          newsCount,
          newsCategoryCountry: newsCategory === 'country',
          newsCategoryRegion: newsCategory === 'region',
          news: news.slice(0, newsCount),
        });
    }
    else {
      res.render('newsform', {
        error: 'Произошла ошибка при попытке скачать код страницы новостей Яндекса',
      });
    }
  });
});

function parseNews(htmlContent, category) {
    const $ = cheerio.load(htmlContent);
    const newsSelector = category === 'country' ? 'div#tabnews_newsc li a' : 'div#tabnews_regionc li a';
    const newsAnchors = $(newsSelector);
    return newsAnchors.map((i, newsAnchor) => $(newsAnchor).text()).get();
}

app.listen(3000);