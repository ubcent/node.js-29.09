const fs = require('fs');

fs.readFile("../HeadsAndTails/gamelog.txt", (error, data) => {
    let
        looses = 0,
        wins = 0;
    let arrayFromData = data.toString().split('\r\n');
    arrayFromData.shift();

    console.log('Игр в Орёл и Решку:', arrayFromData.length);
    arrayFromData.forEach(el => {
        let sub = el.split('Запуск игры в Орёл и Решку: ')[1];
        if (sub === 'Победил игрок') {
            wins += 1;
        } else if (sub === 'Победил компьютер') {
            looses += 1;
        }
    }); // 10 - 100%;
    console.log(`Побед: ${wins}, Поражений: ${looses}; Винрейт: ${100 / arrayFromData.length * wins}%`);
    console.log();
});

fs.readFile("../BlackJack/gamelog.txt", (error, data) => {
    let
        looses = 0,
        wins = 0;
    let arrayFromData = data.toString().split('\r\n');
    arrayFromData.shift();

    console.log('Игр в BlackJack:', arrayFromData.length);
    arrayFromData.forEach(el => {
        let sub = el.split('Запуск игры в BlackJack: ')[1];
        if (sub === 'Победил игрок') {
            wins += 1;
        } else if (sub === 'Победил компьютер') {
            looses += 1;
        }
    });
    console.log(`Побед: ${wins}, Поражений: ${looses}; Винрейт: ${100 / arrayFromData.length * wins}%`);
});