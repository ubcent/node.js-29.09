const needle = require('needle');
const readline = require('readline');
const key = require('./key');

const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }
);

const api = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
let lang = 'en-ru';
let format = 'plain';

rl.question('Введите фразу на английском: ', answer => {
    let text = answer.toLowerCase();
    let url = api + '?key=' + key + '&text=' + text + '&lang=' + lang + '&format=' + format;
    needle.get(url, function(error, response) {
        if (!error && response.statusCode == 200)
            console.log(response.body.text[0]);
    });
    rl.close();
});
