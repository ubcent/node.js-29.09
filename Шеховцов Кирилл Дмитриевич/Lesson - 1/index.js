/* Задание 1 */
require('./hello');
require('./hello-npm'); // Модифицировал код промиссом

/* Задание 2 */
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => { // Мне больше нравится использовать Arrow Functions
    res.send('Hello World')
});

app.listen(port);

/* Задание 3 */

class CategorizedLogs { // В своих проектах я предпочитаю работать с консолью так
    log(object) {console.log(`[Log] ${object}`);}
    info(object) {console.info(`[Info] ${object}`);}
    debug(object) {console.log(`[Debug] ${object}`);}
    warn(object) {console.warn(`[Warning] ${object}`);}
    error(object) {console.error(`[Error] ${object}`);}
}

const colors = require('colors/safe');
const beep = require('./hello-npm');
const beepbeep = require('beepbeep');
const cat = new CategorizedLogs;


beep.beep(); // Из модифицированного мною модуля
beepbeep(); // Из модуля beepbeep

cat.log(colors.green('Hello')); // Outputs green text
cat.info(colors.red.underline('I like cake and pies')); // Outputs red underlined text
cat.debug(colors.inverse('Inverse the color')); // Inverses the color
cat.warn(colors.rainbow('OMG Rainbows!')); // Rainbow
cat.error(colors.trap('Run the trap')); // Drops the bass
