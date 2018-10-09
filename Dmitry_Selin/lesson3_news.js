// Скрипт для получения новостей с домашней страницы Яндекса, https://yandex.ru
const request = require('request');
const cheerio = require('cheerio');

request('https://yandex.ru', (err, response, body) => {
    if(!err && response.statusCode === 200) {
        news = getNews(body);
        console.log('Заголовки новостей Яндекса:');
        for(var i in news) {
            console.log(`${+i + 1}. ${news[i]}`);
        }
    }
    else {
        console.log('Произошла ошибка при попытке скачать код страницы');
    }
});

// function to parse html and get news headlines
function getNews(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const newsAnchors = $('div#tabnews_newsc li a');

    result = [];
    for(var i=0; i < newsAnchors.length; i++) {
        result.push($(newsAnchors[i]).text());
    }
    return result;
}
