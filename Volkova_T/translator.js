import readline from 'readline';
import needle from 'needle';

import { TOKEN, URL } from './data';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

translate();

function translate() {
  console.log('Введите слово для перевода, для выхода нажмите ctrl+C');
  rl.on('line', word => {
    if (word) {
      const lang = defineLang(word);
      const str = encodeURIComponent(word);
      const url = `${URL}${TOKEN}&text=${str}&lang=${lang}`;
      needle.get(url, (err, res) => {
        if (!err && res.statusCode === 200) {
          console.log('Перевод: ', res.body.text.toString());
        } else {
          console.log(err, res.statusCode);
        }
      });
    } else {
      console.log('Введите слово или нажмите ctrl+C');
    }
  });
}

function defineLang(str) {
  if (str.match(/([a-z].*[а-яё]|[а-яё].*[a-z])/i) === null) {
    if (str.match(/[a-z]/i) === null) {
      return 'ru-en';
    } else {
      return 'en-ru';
    }
  } else {
    return 'Incorrect characters';
  }
}
