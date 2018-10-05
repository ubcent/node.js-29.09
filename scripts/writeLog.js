import fs from 'fs';

export default function writeLog(fileName, log) {
  fs.appendFile(fileName, log, (err) => {
    if (err) console.log('Ошибка записи файла');
  });
}
