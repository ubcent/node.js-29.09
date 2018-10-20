const ansi = require('ansi');
let cursor = ansi(process.stdout);

function beep() {
    let promise = new Promise((resolve, reject) => {
        try {
            cursor.beep();
            resolve('Beep is done');
        } catch (e) {
            reject(`Beep is NOT done. Error: ${e}`);
        }
    });

    promise.then(
        resolve => console.log(resolve),
        reject => console.log(reject)
    );
}

beep();

module.exports.beep = beep;