const request = require('request');
const readline = require('readline');

let inputUserText; //переменная для хранения введенного текста пользователем
let translateFromYandex;//переменная куда будет помещаться переведенный текст от яндекса

const rl = readline.createInterface ({
  input: process.stdin,
  output: process.stdout
});

//переменная с адресом API яндекса
const urlYandex ='https://translate.yandex.net/api/v1.5/tr.json/translate';

//ожидаем ввод пользователя и после ввода отправляем запрос в API яндекса
//получив ответ, запускаем функцию вывода переведенного текста в Console
const promise = new Promise (function (resolve, reject){
  rl.question('Введите слово или текст для перевода:',(answer) => {
  inputUserText = answer;
  resolve('res');
  }); 
});

promise
  .then(
  	res => {
      request({
        method:'GET',
        url: urlYandex,
	    qs: {
	  	key: 'trnsl.1.1.20181009T175005Z.e557ec1f4f8fe2f6.b257edb82f66ea72ddf05d521774318f72a03408',
	  	text: inputUserText,
	  	lang: 'ru-en'}
        }, (err, response, body) => {
	      if (!err && response.statusCode === 200) {
	        translateFromYandex = body;
	        console.log('\n Ожидайте,осуществляется перевод на английский язык...');
	        setTimeout(funcConsoleAnswer,2000);
	      }
        });
      },
    error => {
    	console.log("Rejected: " + error);
    }
  );

//парсим JSON строку от Яндекса, достаем значение, где храниться переведенный текст и выводим в консоль
function funcConsoleAnswer(){
  let parseFromYandex = JSON.parse(translateFromYandex);
  let valueParse = parseFromYandex.text[0];
  console.log(valueParse,'\n \n нажмите ctrl+c для повторного перевода текста');
};