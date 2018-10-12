const rl = require('readline').createInterface({input: process.stdin, output: process.stdout});
const fs = require('fs');

function randInt(min, max) {return Math.round(min - 0.5 + Math.random() * (max - min + 1));}

rl.question(`Запуск игры в Орёл И Решку. \nНапишите число, чтобы угадать значение. (Ctrl + D - закрыть консоль) \n(Орёл - 0, Решка - 1) `, answer => {
    let rand = randInt(0, 1);

    fs.appendFileSync('gamelog.txt', '\r\nЗапуск игры в Орёл и Решку: ');
    answer = parseInt(answer);

    console.log(`Ваша ставка ${answer === 0 ? 'Орёл' : 'Решка'}`);
    console.log(`Ответ компьютера ${rand === 0 ? 'Орёл' : 'Решка'}`);
    console.log(`Вы ${answer === rand ? 'угадали :)' : 'не угадали :('}`);

    fs.appendFileSync('gamelog.txt', `${answer === rand ? 'Победил игрок' : 'Победил компьютер'}`);
    rl.close();
});