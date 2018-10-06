const fs = require('fs');

fs.readFile('./out.txt', (err, data)=> {
	if(err) {
		console.error(err);
		return;
	};
	let str = data.toString();
	let strArr = new Array();
	strArr = str.split(',');

	let countLoss=0;
	console.log('Всего попыток угадать ОРЕЛ или РЕШКА было:',strArr.length);
	for (let i = 0; i < strArr.length; ++i) {
		if (strArr[i]=='1 ОРЕЛ') {
			countLoss++;
			console.log('Из ',strArr.length, ' проигрышных поппыток:', countLoss);
		} else {
			console.log('Ожидаем статистику...');
		};
	};

});

