import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Массив допустимых значений для ввода
const arrData = ['exit', '0', '1'];

// Функция "подбрасывания монетки"
function coinToss() {
  return (Math.floor(Math.random() * 2) === 0) ? '0' : '1';
}

console.log('Введите 0 (Орел), 1 (Решка) или exit (выход):');

rl.on('line', userCmd => {
  let log = '';
  let side = coinToss();

  if (arrData.includes(userCmd)) {
    if (userCmd === 'exit') {
      rl.close();
    } else if (userCmd === side) {
      console.log('Вы выйграли');
      log = `WIN. Компьютер - ${side}, пользователь - ${userCmd}\n`;
    } else {
      console.log('Вы проиграли', side);
      log = `LOSE. Компьютер - ${side}, пользователь - ${userCmd}\n`;
    }
  } else {
    log = `ERR. Не правильный ввод - ${userCmd}\n`;
    console.log('Не правильный ввод. Введите 0, 1 или exit');
  }

  fs.appendFile('./log/log_hORt.txt', log, (err) => {
    if (err) {
      throw err;
    }
  });
});
