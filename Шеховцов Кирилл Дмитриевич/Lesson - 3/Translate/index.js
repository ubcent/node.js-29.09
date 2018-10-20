const request = require('request');
const rl = require('readline').createInterface({input: process.stdin, output: process.stdout});
const apikey = require('./apikey'); // Я храню apikey - в отдельном модуле, в целях безопасности я его не публикую

rl.setPrompt('Вводите текст для перевода с русского на английский\nВведите "--выход", чтобы выйти\n');
rl.prompt();

rl.on('line', answer => {
    if (answer && !answer.includes('--выход')) {
        const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apikey}&text=${encodeURI(answer)}&lang=ru-en`;
        request(url, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                try {
                    console.log(JSON.parse(body).text.join(' '));
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log(err);
            }
        });
    } else {
        rl.close();
    }
}).on('close', () => {
    process.exit(0);
});