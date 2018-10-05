const redline = require('readline').createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
);

redline.question('Введите 0 - если орел и  1 если решка: ', answer => {
    answer = parseInt(answer);
    let rez = Math.random()>0.5?1:0;

    if(answer = rez) {
        console.log('Победа, Вы угадали!');
    }else{
        console.log('Поражение, попробуйте еще раз');
    }
    redline.close();
});
