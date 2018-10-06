//--------------------КОД по ЛОГИРОВАНИЮ в ФАЙЛ---------------------
const fs = require('fs');
const {Console} = require('console');
const out = fs.createWriteStream('./out.txt');
const logger = new Console(out);


//------------------------НАЧАЛО ПРОГРАММЫ--------------------------
console.log ('Сыграй в "Орел или Решка": введи 1 или 0 (1 это "ОРЕЛ", 0 это "РЕШКА"),если хочешь выйти из программы - нажми Ctr+c');//приветствие игрока ПОТОК вывода

let computer;//помещаем в переменную значение 1 = 'орел' или 0 = '

let generateNumber = function(){//функция записи в переменную 0 или 1
	if (Math.random() > 0.5){
		computer=1;
	} else {
		computer=0;
	};
};

const readline = require('readline');//подключили модуль для перехвата ввода

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (line)=>{//логика программы -здесь мне не хватает опыта, чтобы применить PROMISE или ASYNC\AWAIT,чтобы не вызывать 3 раза generateNumber()
		if (line==computer && line==1){
			console.log(line," -ОРЕЛ: ты УГАДАЛ!");
			logger.log(line,"ОРЕЛ"+",");
			generateNumber();
		} else if (line==computer && line==0){
			console.log(line," -РЕШКА: ты УГАДАЛ!");
			logger.log(line,"РЕШКА"+",");
			generateNumber();
		} else if (line!=0 && line!=1){
			console.error("Возникла ошибка, видимо ты ввел не 0 и не 1 - попробуй еще раз"+',');
			logger.log("error :введен неверный символ"+',');
		} else {
			console.log(line," -ты ПРОИГРАЛ: КОМП загадал-", computer);
			logger.log(line,"loss"+',');
			generateNumber();
		};
	});
