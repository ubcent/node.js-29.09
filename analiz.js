const fs = require('fs');

var data = fs.readFileSync('game_log.txt','utf8');

reg=/\n/g; n=1;
while (reg.exec(data)) {n++}
console.log('Общее количество партий:  ' + n);

reg=/\n/g; win=0;
while (reg.exec(data)) {win++}
console.log('Количество выигранных :  ' + win);

reg=/Lose/g; lose=0;
while (reg.exec(data)) {lose++}
console.log('Количество проигранных :  ' + lose);

console.log('Процент побед: ' + Math.floor( win * 100 / (n)) + '%');