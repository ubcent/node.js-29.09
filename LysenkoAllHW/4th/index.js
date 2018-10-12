// koa, hapi, loopback
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const consolidate = require('consolidate');
const getNews = require('./app/getNews')
const asyncHandler = require('express-async-handler')

const app = express();

app.engine('pug', consolidate.pug);

app.use(express.static('public'))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));



app.get('/', (req, res, next) => {
  if (req.cookies.count) {
    news = new getNews()
    news.getNewsList((list) => {
      res.render('index', {
        count: req.cookies.count,
        news: list,
      })
    })
  }
  else {
    res.render('index', {
      news: []
    })
  }  
})

app.post('/', (req, res) => {
  if (req.body.count) {
    res.cookie('count', req.body.count);
  }

  res.redirect('/');
})

app.listen(8080)