const
    request = require('request'),
    cheerio = require('cheerio');

request.get('https://www.yandex.ru/', (err, response, body) => {
    if (!err && response.statusCode === 200) {

        function parseAriaLabel(object) {
            for (let i = 0; i < object.length; i++) {
                console.log(`${i + 1}. ${object[i].attribs['aria-label']}`);
            }
        }

        let $, mainData, carouselData;

        $ = cheerio.load(body);
        mainData = $('.list.news__list').html();
        carouselData = $('.list.news__list.news__animation-list').html();

        $ = cheerio.load(mainData);
        mainData = $('li a');

        console.log('Новости Яндекс на Главной');
        parseAriaLabel(mainData);

        $ = cheerio.load(carouselData);
        carouselData = $('li a');

        console.log('\nНовости Яндекс бегущей строкой');
        parseAriaLabel(carouselData);

    } else {
        console.log(err.message);
    }
});