const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('enter 1 or 0: ', answer => {
    const random = Math.round(Math.random());
    console.log(random);
    if (answer == random) {
        console.log('win');
        appendLog(`${answer} \\ win \n`);
        rl.close();
    } else {
        appendLog(`${answer} \\ loose \n`);
        console.log('loose');
        rl.close();
    }
})

appendLog = (answer) => {
    fs.open('log.txt', 'a', (err, fd) => {
        if (err) throw err;
        fs.appendFile(fd, answer, 'utf8', (err) => {
            fs.close(fd, (err) => {
            if (err) throw err;
            });
            if (err) throw err;
        });
    })
}

