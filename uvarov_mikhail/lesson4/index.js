const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');

const news = [
  { title: 'News 1 title', description: 'News 1 description' },
  { title: 'News 2 title', description: 'News 2 description' },
  { title: 'News 3 title', description: 'News 3 description' },
  { title: 'News 4 title', description: 'News 4 description' },
  { title: 'News 5 title', description: 'News 5 description' },
];

const app = express();

app.engine('hbs', consolidate.handlebars);

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

app.use(express.static('./public'));

app.all('/', (req, res, next) => {
  
})

app.get('/', (req, res) => {
  console.log('get');
  res.json({ message: 'Hello world' });
});

app.get('/users', (req, res) => {
  res.render('user', {
    userName: 'Vasia Pupkin',
  });
});
/*
app.all('/news', (req, res) => {
  const { count = 4 } = req.body;
  res.render('news', {
	count,
    news: news.slice(0, count),
  });
});
*/

app.get('/news', (req, res) => {
  const { count = 4 } = req.body;
  res.render('news', {
    news,
  });
});

app.post('/news', (req, res) => {
  console.log(req.body);
  const { count = 4 } = req.body;
  res.json(news.slice(0, count));
});

app.get('/users/:userId', (req, res) => {
  res.send('User id#' + req.params.userId);
});

app.post('users', (req, res) => {
  console.log(req.body);
  res.send('OK');
});

app.listen(3000)

