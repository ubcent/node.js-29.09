var request = require('request');
var argv = require('minimist')(process.argv.slice(2));

if (typeof (argv.w) === 'undefined') {
    console.log('Pleace specify the parameter -w');
    return;
}

const key = 'trnsl.1.1.20181007T093207Z.eabef545120f15db.8fbb918c5a7576998b57172e5c7cf3fc4d8ee86f';

request('https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key +
    '&text=' + argv.w + '&lang=en-ru&format=plain', function (error, response, html) {
        html = JSON.parse(html);
        if (html.code == 200) {
            console.log(html.text[0]);
        }
        else {
            console.log('Error' + html.code + ' ' + html.message)
        }
    });
