const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const express = require('express');
const consolidate = require('consolidate');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

const url = 'http://uk.ufc.com/rankings';
let resParseUrl = [];
request(url, (err, response, body) => {
  if(!err && response.statusCode === 200){
    const $ = cheerio.load(body);
    const fighterList = $($('.ranking-list.tall')[4]).find('.name-column a');
    fighterList.each((idx, item) => {
      let itemParse = ((idx + 1) + '.' + $(item).text().trim());
      resParseUrl.push(itemParse);
    })
   }
});

app.get('/form', (req, res) => {
  res.render('form.hbs', {
    name: 'Conor',
    content: resParseUrl,//как сделать так, чтобы при нажатии на кнопку отправить сюда выводился результат ПАРСИНГА - я так и не понял! 
  });
});

app.listen(3000);