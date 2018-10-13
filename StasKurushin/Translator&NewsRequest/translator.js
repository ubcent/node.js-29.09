const request = require('request');

const key = 'trnsl.1.1.20181008T151344Z.cd29d42a1786fbab.98bf32f6aad75caccb5e0427356413275c6db385';


 buildUrl = (key, text, lang) => {
    return `https://translate.yandex.net/api/v1.5/tr.json/translate`+
    `?key=${key}&text=${text}&lang=${lang}`
}

sendRequest =() => {
    request(buildUrl(key, 'how are you', 'en-ru'), (err, response, body) => {
        if(!err && response.statusCode === 200) {
            console.log(JSON.parse(body).text.join())
        }
    })
}

sendRequest();