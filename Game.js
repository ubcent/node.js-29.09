const readline = require('readline');
const fs = require('fs');

class Game {
    constructor(fileName){
        if(!fs.existsSync(fileName)){
            fs.writeFile(fileName, "");
        }
        this.fileName = fileName;
    }
    start(){
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        //предложить ввести номер
        fs.appendFile(this.fileName, "\nStart game");
        console.log("Введите число: либо 0 - орел, либо 1 - орешка");
        //обработка событий
        rl.on("line", (number) =>{
            if(isNaN(number)){
                fs.appendFile(this.fileName, "\nNaN");
                console.log("Вы ввели не число");
            } else if (number != 0 && number != 1){
                fs.appendFile(this.fileName, "\nNot 0 or 1");
                console.log("Нужно ввести 0 - орел, либо 1 - орешка");
            } else {
                let compNum =  Math.round(Math.random());
                if(number == compNum){
                    fs.appendFile(this.fileName, "\nWIN");
                    console.log("Угадали! Попробуйте еще.");
                } else {
                    fs.appendFile(this.fileName, "\nLOSE");
                    console.log("Не угадали! Попробуйте еще раз.");
                }
            }
        })
    }
}

let fileLog = process.argv.slice(2)[0];
let miniGame = new Game(fileLog);
miniGame.start();