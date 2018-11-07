const express = require('express')
var templating = require('consolidate');
bodyParser = require('body-parser');
const app = express()
const port = 3000

// выбираем функцию шаблонизации для hbs
app.engine('hbs', templating.handlebars);
// по умолчанию используем .hbs шаблоны%
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }))
// указываем директорию для загрузки шаблонов
app.set('views', __dirname + '/views');
// обрабатываем запросы к главной странице
app.get('/', function (req, res) {
    const tit = 'Привет, handlebars!';
    res.render('hello', {
        news: tit
    });

    
});

app.post('/', function (req, res) {

    const news = httpGet(req.body.site, req.body.pages);
    console.log(news);

    res.render('hello', {
        news: news
    });
});

app.listen(port, () => console.log(`app listening on port ${port}!`))

function httpGet(siteName, pageCnt) {
    var request = require('sync-request');
    var cheerio = require('cheerio');

    const sites = {
        habr: {
            url: 'https://habr.com/',
            tag: '.post__title_link'
        },
        fronteder: {
            url: 'https://frontendfront.com/',
            tag: '.story-link'
        }
    }

    var response = request(
        'GET',
        sites[siteName].url
    );

    var $ = cheerio.load(response.body);
    var rez = [];
    var cnt = 0;
 
    $(sites[siteName].tag).each(function (i, element) {
        if (cnt < pageCnt) {
            cnt++;
            rez.push((i + 1) + ')' + element.children[0].data);
        }
    });
    return rez;
}
