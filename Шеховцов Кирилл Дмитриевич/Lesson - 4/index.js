const path = require('path');
const express = require('express');
const consolidate = require('consolidate');
const request = require('request');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const url = 'https://www.ria.ru/';
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.set('views', path.resolve(__dirname, 'views'));
app.engine('pug', consolidate.pug);
app.set('view engine', 'pug');

function callRequest(reqEl, res, action) {
    function checkCat(cat) {
        switch (cat) {
            case 'politics':
                return true;
            case 'society':
                return true;
            case 'economy':
                return true;
            default:
                return false;
        }
    }

    function catName(cat) {
        switch (cat) {
            case 'politics':
                return 'Политика';
            case 'society':
                return 'Общество';
            case 'economy':
                return 'Экономика';
        }
    }

    if (!checkCat(reqEl.cat)) {
        reqEl.cat = 'politics';
    }

    if (action === 'render') {
        request.get(url + reqEl.cat, (err, response, body) => {

            if (!err && response.statusCode === 200) {
                let array = [];
                let $ = cheerio.load(body);
                let data = $('.l-main-column .b-lists-wr .b-list-normal .b-list').html();
                $ = cheerio.load(data);
                $('.b-list__item').each((i, el) => {
                    const $$ = cheerio.load(el);
                    array.push($$('.b-list__item-title span').text());
                });

                if (reqEl.count) {
                    try {
                        reqEl.count = parseInt(reqEl.count);
                    } catch (e) {
                        console.log(e);
                    }

                    if (reqEl.count > 0 && array.length > reqEl.count) {
                        array.splice(reqEl.count);
                    }
                } else {
                    reqEl.count = 20;
                }
                res.cookie('cat', reqEl.cat);
                res.cookie('count', reqEl.count);
                res.render('index', {news: array, cat: catName(reqEl.cat), sel: reqEl.cat, count: reqEl.count});
            } else {
                console.log(err);
            }
        });
    } else if (action === 'redirect') {
        res.cookie('cat', reqEl.cat);
        res.cookie('count', reqEl.count);
        res.redirect(`/?cat=${reqEl.cat}&count=${reqEl.count}`);
    }
}

app.post('/settings', (req, res) => {
    callRequest(req.body, res, 'redirect');
});

app.get('/', (req, res) => {
    if (req.cookies) {
        req.query.cat = req.cookies.cat;
        req.query.count = req.cookies.count;
    }
    callRequest(req.query, res, 'render');
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}!`);
});