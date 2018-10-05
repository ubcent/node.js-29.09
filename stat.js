const fs = require('fs');
let arr = [];
fs.readFile('./log.txt', function (err, data) {
    if (err) throw err;
    arr = data.toString().split(' ');
    const gamesAmount = arr.length - 1;
    const victoriesAmount = arr.filter(x => x == 'win').length;
    const losingsAmount = arr.filter(x => x == 'loose').length;
    const statLog = `*****\nGames amount: ${gamesAmount}\n
Victories amount: ${victoriesAmount}\n
Losings amount: ${losingsAmount}\n
win | loose (${victoriesAmount} | ${losingsAmount})`
    fs.writeFile('./log.txt', '', () => {
        console.log('...preparing log.txt for pushing statistics')
    })
    fs.open('log.txt', 'a', (err, fd) => {
        if (err) throw err;
        fs.appendFile(fd, statLog, 'utf8', (err) => {
            fs.close(fd, (err) => {
                if (err) throw err;
            });
            if (err) throw err;
        });
    })
});