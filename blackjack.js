const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
});

var card = [{name: '6♠', val: 6}, {name: '7♠', val: 7}, {name: '8♠', val: 8}, {name: '9♠', val: 9}, {name: '10♠', val: 10}, {name: 'В♠', val: 2}, {name: 'Д♠', val: 3}, {name: 'К♠', val: 4}, {name: 'Т♠', val: 11}, {name: '6♣', val: 6}, {name: '7♣', val: 7}, {name: '8♣', val: 8}, {name: '9♣', val: 9}, {name: '10♣', val: 10}, {name: 'В♣', val: 2}, {name: 'Д♣', val: 3}, {name: 'К♣', val: 4}, {name: 'Т♣', val: 11}, {name: '6♥', val: 6}, {name: '7♥', val: 7}, {name: '8♥', val: 8}, {name: '9♥', val: 9}, {name: '10♥', val: 10}, {name: 'В♥', val: 2}, {name: 'Д♥', val: 3}, {name: 'К♥', val: 4}, {name: 'Т♥', val: 11}, {name: '6♦', val: 6}, {name: '7♦', val: 7}, {name: '8♦', val: 8}, {name: '9♦', val: 9}, {name: '10♦', val: 10}, {name: 'В♦', val: 2}, {name: 'Д♦', val: 3}, {name: 'К♦', val: 4}, {name: 'Т♦', val: 11},
];

function showStatus(person) {
    let sum = 0;
    let carts = ''
    person.forEach(function (element) {
        carts += '['+ element[0].name + ']';
        sum += element[0].val;
    });
    console.log('Карты: ' + carts + ' cумма: ' + sum);
    return sum;
}


function gameOwer(rez) {
    const fs = require('fs');
    fs.appendFile('game_log.txt', '\n'+rez, (err) => {
        if (err) throw err;
    console.log('Статистика обновлена');
    process.exit(0);
    });
}

// Сдаем карты
card.sort(function (a, b) {
    return Math.random() > 0.5;
});

// Игрок заходит
player = [];

// Игрок получает 2 карты
player.push(card.splice(1, 1));
player.push(card.splice(1, 1));
console.log('Ваши карты:');
showStatus(player);


rl.on('line', (line) => {
    switch (line.trim()) {
        case 'еще':
            player.push(card.splice(1, 1));
            sum = showStatus(player);
            if(sum > 21){console.log(`Игра окончена`);
                gameOwer('Lose [too match]');
            }
            break;
        case 'хватит':
            console.log('Ваши карты:');
            playerScore = showStatus(player);

            bank = [];
            bank.push(card.splice(1, 1));
            bank.push(card.splice(1, 1));
            console.log('Банкир берет карты:');
            bankScore= showStatus(bank);
            while(bankScore < 14){
                console.log('Банкир берет карту:');
                bank.push(card.splice(1, 1));
                bankScore= showStatus(bank);
            }

            if(playerScore == bankScore){
                console.log('Ничья');
                gameOwer('No one\'s');
            }else if(playerScore > bankScore || bankScore > 21){
                console.log('Вы выиграли');
                gameOwer('Win');
            }else{
                console.log('Вы проиграли');
                gameOwer('Lose');
            }
            break;
        default:
            console.log(`Скажите еще или хватит`);
            break;
    }
rl.prompt();
}).on('close', () => {
    console.log('Have a great day!');
});