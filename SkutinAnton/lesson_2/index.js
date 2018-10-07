const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('Угадай какое число загадал компьютер 1 или 0');
let round = 1;

rl.on('line', (text) => {
  const randomNumber = Math.round(Math.random());

  if (text > 1) {
    console.log('Число должно быть 0 или 1');
  } else if (isNaN(text)) {
    console.log('Вы ввели некоректный символ!');
  } else if (text == randomNumber) {
    round = finishGame(round, round);
  } else if (text !== randomNumber) {
    console.log('Почти угадал =)!');
  }

  round++;
})


const finishGame = (round, randomNumber) => {
  console.log(`Вы угадали! Загаданное число было ${randomNumber}\n`);
  rl.question('Еще разок? Да или Нет\n', (answer) => {
    if (answer.toLowerCase() == 'нет'.toLowerCase()) {
      rl.close();
    } else {
      console.log('\nТогда еще раз угадай какое число загадал компьютер 1 или 0');
    }
  })

  fs.appendFileSync('./result.txt', `\nПобеда! Кол-во раундов ${round}`);
  return 0;
}