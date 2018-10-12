const needle = require('needle');
const cheerio = require('cheerio');

const parseNewsYandex = (categories) => {
  const rootUrl = 'https://news.yandex.ru/';

  // Переменная для списка новостей, которую функция потом вернет
  let arrNews = [];

  // Формируем url для каждой категории, парсим и записываем список новостей в массив
  categories.map(item => {
    const url = `${rootUrl}${item}.rss`;

    needle.get(url, { parse: false }, (err, resp, body) => {
      if (!err && resp.statusCode === 200) {

        const $ = cheerio.load(body, {
          xmlMode: true
        });

        const list = $('channel').find('item');
        list.each(function () {
          const title = $(this).find('title').text();
          const textPrev = $(this).find('description').text();

          arrNews.push({
            title: title,
            text: textPrev
          });

        });

        return arrNews;

      } else {
        console.log(err, res.statusCode)
      }
    });
  });
};

module.exports = parseNewsYandex;
