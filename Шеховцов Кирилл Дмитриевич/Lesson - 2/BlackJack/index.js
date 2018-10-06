const
    rl = require('readline').createInterface({input: process.stdin, output: process.stdout}),
    fs = require('fs');

function randInt(min, max) { return Math.round(min - 0.5 + Math.random() * (max - min + 1)); }

function newLine() { console.log(); }

function scoresOfNum(num) {
    let titles = ['очко', 'очка', 'очков'];
    return titles[(num % 10 === 1 && num % 100 !== 11 ? 0 : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? 1 : 2)];
}

function distribution(gameObject, show, amount) {
    if (!(amount && amount > 0)) {amount = 1;} // Базовое значение
    for (let i = 0; i < amount; i++) {
        let rand = randInt(0, cards.length - 1);
        gameObject.inventory.push(cards[rand]);
        gameObject.scores += cards[rand].score;
        if (show) {
            if (gameObject.type === 'player') {
                console.log('Вы получили карту', cards[rand].name);
            } else if (gameObject.type === 'computer') {
                console.log('Компьютер получил карту', cards[rand].name);
            }
        }
        cards.splice(rand, 1);
    }
}

function showScores(gameObject) {
    if (gameObject.type === 'player') {
        console.log(`У вас ${gameObject.scores} ${scoresOfNum(gameObject.scores)}`);
    } else if (gameObject.type === 'computer') {
        console.log(`У компьютера ${gameObject.scores} ${scoresOfNum(gameObject.scores)}`);
    }
}

function showInventory(gameObject) {
    let str = '';
    gameObject.inventory.forEach(el => { str += ', ' + el.name; });
    str = str.slice(2);
    if (gameObject.type === 'player') { console.log(`Ваши карты: ${str}`); }
    else if (gameObject.type === 'computer') { console.log(`Карты компьютера: ${str}`); }
}

function showCardsAmount() { console.log(`Количество карт ${cards.length}`); }

function checkLoose(gameObject) { return gameObject.scores > 21; }

function checkTwentyOne(gameObject, gameObject1) {
    if (gameObject.scores === 21 && gameObject1 === 21) {
        return 'playerWin';
    } else {
        if (gameObject.scores === 21) {
            return 'playerWin';
        } else if (gameObject1.scores === 21) {
            return 'computerWin';
        } else {
            return 'nobodyWin';
        }
    }
}

function checkForAce(gameObject) {
    let bool = false;
    gameObject.inventory.forEach(el => {
        if (el.name.toLowerCase().includes('туз')) { bool = true; }
    });
    return bool;
}

function swapAce(gameObject) {
    let cardNum = 0;
    for (let i = 0; i < gameObject.inventory.length; i++) {
        if (gameObject.inventory[i].name.toLowerCase().includes('туз')) {
            cardNum = i;
            break;
        }
    }

    gameObject.inventory[cardNum].name += ' (как одно очко)';
    gameObject.scores -= 10;
}

function pickACardComputer() {
    if (computer.scores <= 10) {
        newLine();
        console.log('Копмьютер берёт карты');
        distribution(computer, false);
        if (checkLoose(computer)) {
            if (checkForAce(computer)) {
                swapAce(computer);
            } else {
                newLine();
                showInventory(computer);
                showScores(computer);
                fs.appendFileSync("gamelog.txt", "Победил игрок");
                console.log('Вы победили!');
                rl.close();
            }
        }
    }
}

function pickACardPlayer() {
    rl.setPrompt('Вы берете еще карту? (1, y, д - Да | 2, n, н - Нет) ');
    rl.prompt();

    rl.on('line', answer => {
        if (answer === '1' || answer === 'y' || answer === 'д') {
            distribution(player, true); // Раздаём игроку карту
            newLine();
            showInventory(player);
            showScores(player);
            if (checkLoose(player)) { // Смотрим не перебрал ли он очков
                if (checkForAce(player)) { // Если перебрал, смотрим есть ли Туз
                    swapAce(player); // Туз используем как одно очко
                    newLine();
                    showInventory(player);
                    showScores(player);
                    pickACardComputer(); // Компьютер может взять карту
                    rl.prompt(); // Начинаем ввод снова
                } else { // Туза нет и перебор по очкам
                    newLine();
                    showInventory(computer);
                    showScores(computer);
                    fs.appendFileSync("gamelog.txt", "Победил компьютер");
                    console.log('Победил компьютер!');
                    rl.close(); // Закрываем ввод
                }
            } else if (player.scores === 21) { // Проверяем не набрал ли игрок 21 после возможного добора карты
                newLine();
                showInventory(computer);
                showScores(computer);
                fs.appendFileSync("gamelog.txt", "Победил игрок");
                console.log('Вы победили!');
                rl.close();
            } else {
                pickACardComputer();
                rl.prompt();
            }
        } else if (answer === '2' || answer === 'n' || answer === 'н') {
            pickACardComputer(); // Хоть мы и выразили своё фи, сказав, что не берем карты - компьютер может взять карту
            if (player.scores > computer.scores) {
                newLine();
                showInventory(player);
                showScores(player);
                newLine();
                showInventory(computer);
                showScores(computer);
                fs.appendFileSync("gamelog.txt", "Победил игрок");
                console.log('Вы победили!');
                rl.close();
            } else {
                newLine();
                showInventory(player);
                showScores(player);
                newLine();
                showInventory(computer);
                showScores(computer);
                fs.appendFileSync("gamelog.txt", "Победил компьютер");
                console.log('Победил компьютер!');
                rl.close();
            }
        } else { // При вводе того, что не ожидалось, повторяем запрос на ввод
            rl.prompt();
        }
    }).on('close', () => {
        process.exit(0); // Выход
    });
}

let cards = [
    {name: 'Двойка Червей', score: 2},
    {name: 'Двойка Пик', score: 2},
    {name: 'Двойка Треф', score: 2},
    {name: 'Двойка Бубн', score: 2},
    {name: 'Тройка Червей', score: 3},
    {name: 'Тройка Пик', score: 3},
    {name: 'Тройка Треф', score: 3},
    {name: 'Тройка Бубн', score: 3},
    {name: 'Четвёрка Червей', score: 4},
    {name: 'Четвёрка Пик', score: 4},
    {name: 'Четвёрка Треф', score: 4},
    {name: 'Четвёрка Бубн', score: 4},
    {name: 'Пятёрка Червей', score: 5},
    {name: 'Пятёрка Пик', score: 5},
    {name: 'Пятёрка Треф', score: 5},
    {name: 'Пятёрка Бубн', score: 5},
    {name: 'Шестёрка Червей', score: 6},
    {name: 'Шестёрка Пик', score: 6},
    {name: 'Шестёрка Треф', score: 6},
    {name: 'Шестёрка Бубн', score: 6},
    {name: 'Семёрка Червей', score: 7},
    {name: 'Семёрка Пик', score: 7},
    {name: 'Семёрка Треф', score: 7},
    {name: 'Семёрка Бубн', score: 7},
    {name: 'Восьмёрка Червей', score: 8},
    {name: 'Восьмёрка Пик', score: 8},
    {name: 'Восьмёрка Треф', score: 8},
    {name: 'Восьмёрка Бубн', score: 8},
    {name: 'Девятка Червей', score: 9},
    {name: 'Девятка Пик', score: 9},
    {name: 'Девятка Треф', score: 9},
    {name: 'Девятка Бубн', score: 9},
    {name: 'Десятка Червей', score: 10},
    {name: 'Десятка Пик', score: 10},
    {name: 'Десятка Треф', score: 10},
    {name: 'Десятка Бубн', score: 10},
    {name: 'Валет Червей', score: 10},
    {name: 'Валет Пик', score: 10},
    {name: 'Валет Треф', score: 10},
    {name: 'Валет Бубн', score: 10},
    {name: 'Дама Червей', score: 10},
    {name: 'Дама Пик', score: 10},
    {name: 'Дама Треф', score: 10},
    {name: 'Дама Бубн', score: 10},
    {name: 'Король Червей', score: 10},
    {name: 'Король Пик', score: 10},
    {name: 'Король Треф', score: 10},
    {name: 'Король Бубн', score: 10},
    {name: 'Туз Червей', score: 11},
    {name: 'Туз Пик', score: 11},
    {name: 'Туз Треф', score: 11},
    {name: 'Туз Бубн', score: 11}
];

let
    player = {type: 'player', inventory: [], scores: 0},
    computer = {type: 'computer', inventory: [], scores: 0};

console.log(`Запуск игры в BlackJack`);
fs.appendFileSync("gamelog.txt", "\r\nЗапуск игры в BlackJack: ");
showCardsAmount();
console.log('Раздаём карты');
newLine();

/* Раздаём по две карты игроку и компьютеру */
distribution(player, true, 2);
newLine();
console.log('Компьютер берёт карты');
distribution(computer, false, 2);

/* Показываем инвентарь и очки игроку */
newLine();
showInventory(player);
showScores(player);

/* Кто-то мог выйграть сразу */
newLine();
if (checkTwentyOne(player, computer) === 'playerWin') {
    showInventory(computer);
    showScores(computer);
    fs.appendFileSync("gamelog.txt", "Победил игрок");
    console.log('Вы победили!');
} else if (checkTwentyOne(player, computer) === 'computerWin') {
    showInventory(computer);
    showScores(computer);
    fs.appendFileSync("gamelog.txt", "Победил компьютер");
    console.log('Победил компьютер!');
} else {
    /* Иначе игрок берёт карту */
    pickACardPlayer();
}