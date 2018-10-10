// Программа для перевода текста, вводимого через консоль, с использованием API Yandex-Переводчика
const yandexApiKey = require('./yandex_translate_api_key.js').yandexTranslateApiKey;
const request = require('request');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function translateEnglishToRussian(text) {
    if(!text) {
        console.log('Введен некорректный текст');
        return;
    }

    var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
    var lang = 'ru-en';
    var req = `${url}?key=${yandexApiKey}&lang=${lang}&text=${encodeURIComponent(text)}`;

    request(req, (err, response, body) => {
        if(!err && response.statusCode === 200) {
            console.log(`Результат перевода:\n${JSON.parse(body).text[0]}`);
        }
        else {
            console.log('Произошла ошибка при выполнении запроса');
        }
    });
}

rl.question('Введите текст для перевода на русском языке\n:>', (answer) =>{
    translateEnglishToRussian(answer);
    rl.close();
    process.stdin.destroy();
});
