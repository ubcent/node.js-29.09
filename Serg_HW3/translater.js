const request = require('request');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const apiKey = 'trnsl.1.1.20181009T151137Z.d7316679e7453c1a.a1cf8a642a4cfa49cc4e8884eeb747a0eb4ad174';
const api = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}`;

function translation(api, words) {
  request(`${api}&text=${words}&lang=en-ru`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let res;

      try {
        res = JSON.parse(body);
      } catch (e) {
        return console.log(e);
      }

      if (res.text) {
        console.log(res.text.join(' '));
      } else {
        console.log('Нет свойства с переводом');
      }
    }
  });
}

function getTranslation() {
  rl.question('Введите слова для перевода:\n', (words) => {
    translation(api, words);

    rl.close();
    process.stdin.destroy();
  });
}

getTranslation();
