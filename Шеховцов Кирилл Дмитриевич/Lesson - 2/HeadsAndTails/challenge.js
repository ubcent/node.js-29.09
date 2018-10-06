require('readline').createInterface({input: process.stdin, output: process.stdout}).question(`Запуск игры в Орёл И Решку. \nНапишите число, чтобы угадать значение. (Ctrl + D - закрыть консоль) \n(Орёл - 0, Решка - 1) `, answer => {
    let rand = Math.round(0.5 + Math.random() * (2));
    console.log(`Ваша ставка ${parseInt(answer) === 0 ? 'Орёл' : 'Решка'} \nОтвет компьютера ${rand === 0 ? 'Орёл' : 'Решка'} \nВы ${parseInt(answer) === rand ? 'угадали :)' : 'не угадали :('}`);
    this.close();
});