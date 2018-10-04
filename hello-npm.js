const ansi = require('ansi');
const cursor = ansi(process.stdout);

console.log("Hello world!");

cursor.beep();
