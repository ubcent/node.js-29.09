import fs from 'fs';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

const fileName = args.f;

fs.readFile(fileName, 'utf-8', (error, data) => {
  if (error) {
    console.log('Такого файла нет');
  }

  const str = data.toString();
  console.log(str);
  const qt = str.match(/\n/ig).length;
  console.log('Всего партий - ', qt);
  const win = str.match(/win/ig).length;
  console.log('Всего выйграно - ', win);
  const lose = str.match(/lose/ig).length;
  console.log('Всего проигрышей - ', lose);
});
