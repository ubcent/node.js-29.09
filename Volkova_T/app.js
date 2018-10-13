const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const parseNewsYandex = require('./parse');

// json с категориями для новостей
const data = require('./data');

const app = express();

app.use(cookieParser());

app.set('view engine', 'pug');

app.use(express.static(path.resolve(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  // устанавливаем переменную для куки, что бы потом передать ее в pug шаблон
  let cookies;

  // Если нужна нам кука есть то приводим ее к массиву, если надо
  if (req.cookies.categories) {
    cookies = req.cookies.categories;
    if (typeof(cookies) === 'string') {
      cookies = cookies.split();
    }
  }

  // Отрисовываем индекс, передаем в него нужные параметры (заголовок, категории, куки)
  res.render('index', {
    title: 'Отправка формы',
    categories: data.categories,
    cookies: cookies
  });
});

app.post('/form', (req, res) => {
  if (!req.body) return res.sendStatus(400);

  // Устанавливаем переменную для полученных категорий из формы
  let ctg = req.body.categories;

  // Если в переенной что-то есть, то устанавливаем куки, и приводим категории к массиву, если надо
  if (ctg) {
    res.cookie('categories', ctg);
    if (typeof(ctg) === 'string') {
      ctg = ctg.split();
    }

    // Парсим новости с нужными нам категориями
    // todo тут я не знаю как вывести список новостей, например в /form
    parseNewsYandex(ctg);
  }

  // Отвечаем серверу и выводим список выбранных категорий
  res.render('form', {
      ctg,
    }
  )
});

app.listen(3000, () => console.log('server work'));
