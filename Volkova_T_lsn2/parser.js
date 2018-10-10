import needle from 'needle';
import cheerio from 'cheerio';

const URL = 'https://bits.media/news/';
const rootUrl = 'bits.media';

needle.get(URL, (err, res) => {
  if (!err && res.statusCode === 200) {
    console.log('******', res.statusCode);
    const $ = cheerio.load(res.body);
    const list = $('#main-news .news-item');
    list.each(function () {
      const title = $(this).find('a.news-name').text();
      const textPrev = $(this).find('div.news-text').text();
      const urlPrev = $(this).find('a.news-preview').attr('href');
      console.log(`Заголовок: ${title}`);
      console.log(`Краткое содержание: ${textPrev}`);
      console.log(`Ссылка на новость: ${rootUrl}${urlPrev}`);
      console.log('***');
    });
  } else {
    console.log('Ошибка', err, res.statusCode);
  }
});
