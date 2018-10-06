const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }
);

rl.question('Орёл или решка? ', answer => {
    answer = answer.toLowerCase();
    let coinSide = Math.random() > 0.5 ? 'орёл' : 'решка';
    let result = answer === coinSide ? 'Правильно! Это ' + coinSide : 'Не правильно! Это ' + coinSide;
    console.log(result);
    rl.close();
    fs.appendFileSync("orelreshka.txt",

`Вопрос: Орёл или решка?
Ответ: ${answer}
Загадано: ${coinSide}
Результат: ${result}
...
`
    );
});