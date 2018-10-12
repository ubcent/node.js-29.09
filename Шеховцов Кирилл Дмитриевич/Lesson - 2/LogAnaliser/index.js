const fs = require('fs');

fs.readFile('../HeadsAndTails/gamelog.txt', (error, data) => {
    let arrayFromData = data.toString().split('\r\n');

    arrayFromData.shift();
    console.log('Игр в Орёл и Решку:', arrayFromData.length);

    const result = arrayFromData.reduce((acc, item) => {
        const sub = item.split('Запуск игры в Орёл и Решку: ')[1];
        if (sub === 'Победил игрок') {
            acc.wins += 1;
        } else if (sub === 'Победил компьютер') {
            acc.looses += 1;
        }

        return acc;
    }, {wins: 0, looses: 0});

    console.log(`Побед: ${result.wins}, Поражений: ${result.looses}; Винрейт: ${100 / arrayFromData.length * result.wins}%`);
    console.log();
});

fs.readFile('../BlackJack/gamelog.txt', (error, data) => {
    let arrayFromData = data.toString().split('\r\n');

    arrayFromData.shift();
    console.log('Игр в BlackJack:', arrayFromData.length);

    const result = arrayFromData.reduce((acc, item) => {
        const sub = item.split('Запуск игры в BlackJack: ')[1];
        if (sub === 'Победил игрок') {
            acc.wins += 1;
        } else if (sub === 'Победил компьютер') {
            acc.looses += 1;
        }

        return acc;
    }, {wins: 0, looses: 0});

    console.log(`Побед: ${result.wins}, Поражений: ${result.looses}; Винрейт: ${100 / arrayFromData.length * result.wins}%`);
});