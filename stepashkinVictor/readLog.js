const fs = require('fs');

fs.readFile('./out.txt', (err, data)=> { //читаем наш лог-файл
  if(err) {
    console.error(err);
	return;
  };

  let str = data.toString();//преобразуем в строку
  let strArr = new Array();
  strArr = str.split(',\n');
  console.log(strArr);
  console.log('Всего попыток угадать ОРЕЛ или РЕШКА было:', strArr.length-1);//отнимаем 1 , т.к.
  																			//в конец массива добавляется лишн.символ при выходе через cntrl+c

  let countLoss = 0;
  let countWinEagle = 0;
  let countWinTails = 0;
  let countErr = 0;

  strArr.forEach(function(item, i, strArr){//пробегаемся по массиву и считаем выигрышные попытки, проигрышные и ошибки ввода
  	if (item == '1 loss' || item == '0 loss'){
  		countLoss++;
  	} else if (item == '1 ОРЕЛ') {
  	    countWinEagle++;
  	} else if (item == '0 РЕШКА'){
  		countWinTails++;
  	} else {
  		countErr++;
  	};
  });

  let countWins = countWinEagle + countWinTails;//считаем сколько раз угадывали орла или решку
  let attemptNotErr = countWins + countLoss;//считаем ВСЕГО количество попыток угадать за исключением ошибок

  console.log('проигрышных попыток было:', countLoss);
  console.log('выигрышных ОРЛОВ было:', countWinEagle);
  console.log('выигрышных РЕШЕК было:', countWinTails);
  console.log('ошибок ввода других символов возникло:', countErr-1); //отнимаем 1 , т.к. выход из
                                                                     //программы Ctrl+c алгоритм тоже посчитает как ошибку
  console.log('Процент выигрышных попыток в этой игре составил: ', (countWins/attemptNotErr)*100,'%');//вывод в % угаданных попыток
});

