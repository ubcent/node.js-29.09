// Параметры командной строки: 
// -l, --log - обязательный, имя лог-файла, куда будет записан результат, и по которому будет рассчитана статистика
// Если параметр не задан - вывести сообщение об ошибке и завершить работу
// Правила игры: компьютер загадывает 1 или 2, пользователю нужно ввести свой вариант
// Если вводит не 1 и не 2 - выдать сообщение об ошибке, вновь запросить ввод ответа
// Если вводит 1 или 2 - выдать ему результат, выиграл или проиграл, записать результат в лог-файл, рассчитать и выдать статистику игр

const minimist = require('minimist');
const rn = require('random-number');
const readline = require('readline');
const fs = require('fs');

// parse command line arguments
const argv = minimist(process.argv.slice(2), {
    alias: {
        log: 'l'
    }
});

if(!argv.log){
    console.log('Ошибка: не задан обязательный параметр -l (--log) - имя лог-файла для статистики');
    process.exit();
}

// generate computer random answer
const computerAnswer = rn({
    min: 1,
    max: 2,
    integer: true
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// main logic
rl.question('Угадайте число - 1 или 2?\n:>', (answer) =>{
    playGame(answer, argv.log);
    rl.close();
    process.stdin.destroy();
});

// helper function and class below
function playGame(answer, logFile){
    // check answer
    var numAnswer = Number(answer);
    if(isNaN(numAnswer) || numAnswer < 1 || numAnswer > 2){
        console.log(`Ошибка: допустимы значения 1 и 2, было введено: ${answer}`);
        return;
    }

    var win = (numAnswer === computerAnswer);
    var message = win ? 'Вы выиграли!' : 'Вы проиграли';
    console.log(message);
    
    var game = {
        gameDate: (new Date()).toLocaleDateString('ru-RU', {hour: 'numeric', minute: 'numeric', second: 'numeric'}),
        userWin: win
    }

    // get stats from file or create them
    var gameStats = new GameStats();
    if(fs.existsSync(logFile)){
        var logFileContents = fs.readFileSync(logFile);
        gameStats = new GameStats(JSON.parse(logFileContents.toString()));
    }
    gameStats.addGame(game);

    // show stats
    var stats = 
`Сыграно раундов: ${gameStats.countRounds()}
Выиграл пользователь: ${gameStats.countUserWins()}
Выиграл компьютер: ${gameStats.countComputerWins()}
Максимально побед пользователя подряд: ${gameStats.countMaxUserWinsInARow()}
Максимально побед компьютера подряд: ${gameStats.countMaxComputerWinsInARow()}
Процент побед пользователя: ${gameStats.countUserWinsPercent()} %`;

    // write new stats to file
    console.log(stats);
    fs.writeFileSync(logFile, JSON.stringify(gameStats.getGames(), null, 2), 'utf-8');
}

class GameStats{
    constructor(games){
        this.games = games ? games : [];
    }

    getGames(){
        return this.games;
    }

    addGame(game){
        this.games.push(game);
    }

    countRounds(){
        return this.games.length;
    }

    countUserWins(){
        var userWins = 0;
        for(var i in this.games)
            if(this.games[i].userWin)
                userWins++;
        return userWins;
    }

    countComputerWins(){
        return this.countRounds() - this.countUserWins();
    }

    countUserWinsPercent(){
        return Math.round(this.countUserWins() / this.countRounds() * 100);
    }

    countMaxWinsInARow(userWins = true){
        var maxWinsInRow = 1;
        var currentWinsInRow = 1;
        for(var i = 1; i < this.games.length; i++){
            if(this.games[i].userWin === userWins && this.games[i-1].userWin === userWins)
                currentWinsInRow++;
            else{
                if(currentWinsInRow > maxWinsInRow)
                    maxWinsInRow = currentWinsInRow;
                currentWinsInRow = 1;
            }
        }
        return Math.max(maxWinsInRow, currentWinsInRow);
    }

    countMaxUserWinsInARow(){
        return this.countMaxWinsInARow();
    }

    countMaxComputerWinsInARow(){
        return this.countMaxWinsInARow(false);
    }
}