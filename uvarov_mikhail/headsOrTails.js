const minimist = require('minimist');
const HelpString = require('./helpstring.js');
const HtStat = require('./htstat.js');
const readline = require('readline');

/**
 * Объявляем переменные
 * @param {string} login имя пользователя для статистики
 * @param {integer} assumption - значение, которое ввел пользователь
 */
let login = '';
let assumption = -1;
const USER_INPUT = ['0', '1', 'e', '-e', 'exit', '-exit', '--exit'];

// Подключаем чтение из консоли
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// В случае - когда ввели все данные, вызываем старт игры
rl.on('close', () => {
	start();
});

// Задаем алиасы
const argv = minimist(process.argv.slice(2), {
	alias: {
		help: 'h',       // вызов подсказки
		stat: 's',       // показ статистики
		login: 'l',      // логин
		assumption: 'a', // задуманное значение
		exit: 'e',       // выход
	}
});

// Проверяем входные данные
if (argv.help) {
	// вызвали подсказку
	help();
	exit();
}
else if (argv.stat) {
	// показываем статистику
	stat();
	exit();
}
else if (argv.exit) {
	exit();
}
else {
	// начинаем игру
	let loginReady = false;
	let assumptionReady = false;
	
	
	
	// для начала проверим ввел ли пользователь login?
	if (!argv.login || 0 === argv.login.length) {
		// запрашиваем логин
		getData();
	}
	else {
		login = prepareString(argv.login);
		login = (login.length > 0)?login:'unknown';
		loginReady = true;
	}
	
	// ввел ли пользователь число?
	if ((!argv.assumption || 0 === argv.assumption.length) && loginReady) {
		// запрашиваем число
		getData();
	}
	else {
		if ( assumptionCorrect(argv.assumption) )
			assumptionReady = true;
		else {
			getData();
		}
	}
	
	
	if (loginReady && assumptionReady) {
		start();
	}
	
	console.log(argv);
}

function assumptionCorrect(value) {
	
	let a_correct = true;
	
	if (USER_INPUT.includes(String(value))) {
		if (value == 0 || value == 1) {
			assumption = value;
		}
		else {
			// ввели exit
			exit();
		}
	}
	else
		a_correct = false;
	
	return a_correct;
}

/**
 * Метод запускается в случае - если через консоль
 * не ввели какие либо необходимые данные
 */
function getData() {
	
	if (login.length === 0 || assumption == -1) {
		
		let assumptionString = 'Введите 0 (Орел) 1 (Решка) [e, exit] для выхода:';
		
		if (login.length === 0)
			console.log('Введите логин для статистики:');
		else
			console.log(assumptionString);
	
		rl.on('line', (line) => {
			if (login.length === 0) {
				login = prepareString(line);
				
				login = (login.length > 0)?login:'unknown';
		
				console.log(assumptionString);
			}
			else {
				
				if (assumptionCorrect(line))
					rl.close();
				else
				{
					console.log('ОШИБКА ВВОДА!');
					console.log(assumptionString);
				}
			}
		});
	
	}
}


function start() {
	let win = (assumption == (Math.random() > 0.5) ? 1 : 0) ?
			true : false;
	
	
	console.log(login + (win ? 
			' поздравляем! Вы выиграли': 
			', повезет в другой раз - попробуйте пройти игру заново'));
	
	// Выводим результаты статистики
	let statistic = new HtStat();
	
	statistic.update(login, win);
	statistic.show(login);
	
	exit();
}

function help() {
	let h = new HelpString;
	h.printBuffer('Игра "орел и решка" - необходимо загадать число 0 или 1 и ввести его, программа тоже загадывает число 0 или 1, если числа совпадают то игрок выиграл, иначе проиграл - статистика игр пишется');
	h.render('-h, --help', 'Инструкция по эксплуатации');
	h.render('-s, --stat', 'Показать статистику');
	h.render('[-l, --login] \'user_login\'', 'Ввод логина пользователя: используется следующим образом: -l \'user_login\'');
	h.render('[-a, --assumption] \'value\'', 'Ввод предполагаемого значения от 0 до 1, вводится следующим образом: -a 0 или -a 1');
	h.render('-e, --exit', 'Чтобы выйти из игры введите -e или --exit');
}

function stat() {
	let stat = new HtStat();
	stat.show();
}

/**
 * Обработка входных строк для безопасности
 * @param {string} str обрабатываемая строка
 * @returns {string}
 */
function prepareString(str) {
	return escape(str);
}

/**
 * Убираем из строки запрещенные символы
 * @param {string} string
 * @returns {string}
 */
function escape(string) {
	
	if (!string)
		return '';
	
    let htmlEscapes = {
        '&': '',
        '<': '',
        '>': '',
        '"': '',
        "'": '',
        ",": '_',
    };
 
    return string.replace(/[&<>"']/g, function(match) {
        return htmlEscapes[match];
    });
};

function exit() {
	process.exit(-1);
}
