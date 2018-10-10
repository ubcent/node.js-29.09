const request = require ('request');
const readline = require ('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (line) => {
    if (!line) {
        console.log('Введите слово или фразу на английском!')
    } else {
        console.log('Переводим на русский: ', line);
    }
    
// Query-параметры API Yandex Translator
const key = 'trnsl.1.1.20181008T093211Z.1e05f0bc722252ac.63240be89e38a88000db033ba2e4c01b7f7daf50';
const api = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
const lang = '&lang=en-ru&format=plain';

let url = api + '?';
url += 'key=' + key;
url += '&text=' + line;
url += lang;

request(url, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            console.log(JSON.parse(body).text[0]);
        }
        else if (err) {
            return console.log(err);
        } 
    });
});

