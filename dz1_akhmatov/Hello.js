const chalk = require('chalk');
const log = console.log;
log(chalk.blue('Hello') + ' World' + chalk.red('!'));

var ansi = require("ansi");
var cursor = ansi(process.stdout);
cursor.beep();