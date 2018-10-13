const cookieParser = require('cookie-parser');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const path = require('path');

const app = express();

app.engine('hbs', consolidate.handlebars);

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/', (req, res) => {
  translate(req.body).then(answer => {
    res.render('form', {
      translate: answer,
      title: 'Перевод',
    })
    res.cookie('translate', answer, { maxAge: 900000 });
  })
});

app.listen(3000);


const translate = (options) => {
  const key = 'trnsl.1.1.20181008T180129Z.a050de2adeb92ac1.3014a7c64afe961802b8b79528d8d221f5c4e50b';
  const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
  const answer = new Promise((resolve, reject) => {
    request.post(
      url,
      {
        form: {
          key: key,
          text: options.text,
          lang: options.lang
        }
      }, 
      (err, res, body) => {
        if (!err && res.statusCode === 200) {
          return resolve(JSON.parse(body).text[0])
        }
      }
    );
  })

  return answer;
}