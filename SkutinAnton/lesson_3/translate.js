const request = require('request');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log
(`
Вас приветствует переводчик. Введите предложение на русском и мы его быстренько переведем.
Если захотите выйти напишите слово exit.
`)
rl.on('line', text => {
  if (text === 'exit') {
    rl.close();
  } else {
    translate(text);
  }
})

const translate = (text) => {
  const key = 'trnsl.1.1.20181008T180129Z.a050de2adeb92ac1.3014a7c64afe961802b8b79528d8d221f5c4e50b';
  const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

  request.post(
    url,
    {
      form: {
      key: key,
      text: text,
      lang: 'ru-en'
    }
  }, (err, res, body) => {
    if(!err && res.statusCode === 200) {
      const answer = JSON.parse(body).text[0];
      console.log(`
      Ваша фраза: ${text}
      Ваш перевод: ${answer}
      `);
    }
  });
}