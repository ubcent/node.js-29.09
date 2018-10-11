var request = require('request');
var readline = require('readline');
var argv = require('minimist')(process.argv.slice(2));
require('buffer').Buffer;

var rl = readline.createInterface({
  input: process.stdin, // ввод из стандартного потока
  output: process.stdout // вывод в стандартный поток
});

// argv - объект аргуметов
// cmd - строка введенная пользователем

rl.on('line', function (cmd) {
  yandexTranslate(Buffer.from(cmd));
});


function yandexTranslate(textValue) {
  const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';
  const key = 'key=';
  const keyValue = 'trnsl.1.1.20181010T120807Z.140c14b358c2f9cb.c86b7fb9bfa932f8c1cccef1d5c73843368403ef';
  const text = '&text=';
  const translateDirection = '&lang=';
  const translateDirectionValue = 'ru-en';

  const requestField = url + key + keyValue + text + textValue + translateDirection + translateDirectionValue;

  request(encodeURI(requestField), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Перевод:', JSON.parse(body).text[0].toString() );
    }
  });
}

console.log('Введите русский текст для перевода на английский');
