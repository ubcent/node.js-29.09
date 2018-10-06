const
    request = require('request'),
    rl = require('readline').createInterface({input: process.stdin, output: process.stdout}),
    apikey = require('./apikey'); // Я храню apikey - в отдельном модуле, в целях безопасности я его не публикую

rl.setPrompt('Вводите текст для перевода с русского на английский\nВведите "--выход", чтобы выйти\n');
rl.prompt();

rl.on('line', answer => {
    if (answer && !answer.includes('--выход')) {
        let url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apikey}&text=${encodeURI(answer)}&lang=ru-en`;
        request(url, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                console.log(JSON.parse(body).text.join(' '));
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