import readline from 'readline';

import { CART_COLLECTION } from './scripts/CONST';
import writeLog from './scripts/writeLog';
import getCard from './scripts/getCard';

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Начнем игру, компьютер раздает: ');

// Раздаем карты игроку
let scoreUser = getCard(CART_COLLECTION, 'user');
scoreUser += getCard(CART_COLLECTION, 'user');

// Раздаем карты компьютеру
let scoreComp = getCard(CART_COLLECTION);
scoreComp += getCard(CART_COLLECTION);

console.log('Ваши начальные очки - ', scoreUser);

/**
 * Проверяем сколько очков у нас на руках. Если вы уже выйграли или проиграли, то игра заказчивается, при этом
 * ведется запись логов.
 * Если нет, то продолжаем играть и вызывает функцию startGame.
 *
 * @param {number} score Количество очков игрока в начальной руке.
 * @return {string} console.log Сообщение о выйгрыше или проигрыше
 */
function initCheck(score) {
  if (score === 21) {
    writeLog('./log/log_BJ.txt', `WIN. Вы выйграли, ваши очки - ${score}\n`);
    rl.close();
    return console.log(`WIN. Вы выйграли, ваши очки - ${score}`);
  }
  if (score > 21) {
    writeLog('./log/log_BJ.txt', `LOSE. Вы проиграли, ваши очки - ${score}\n`);
    rl.close();
    return console.log(`LOSE. Вы проиграли, ваши очки - ${score}`);
  } else {
    startGame();
  }
}

initCheck(scoreUser);

/**
 * Открываем диалог с пользователем. Брать
 * ведется запись логов.
 * Если нет, то продолжаем играть и вызывает функцию startGame.
 *
 * @return {string} console.log Сообщение о выйгрыше или проигрыше
 */
function startGame() {
  rl.question('Еще [1] или хватит [0]?\n', userCmd => {
    if (userCmd === '1') {

      console.log('Ок. Берем еще');
      // берем еще карты
      scoreUser += getCard(CART_COLLECTION, 'user');
      // проверяем выйграли мы или проиграли, колбэк запускает диалог (брать карты или нет) еще раз
      checkWin('Вы', scoreUser, startGame);

    } else if (userCmd === '0') {
      console.log('СТОП. Ваши очки - ', scoreUser);
      console.log('Теперь играет компьютер');

      playingComputer();

      scoring(scoreUser, scoreComp);
      rl.close();

    } else {
      console.log('Вы ввели не правильное значение. Игра прервана');
      rl.close();
    }
  });
}

/**
 * Функция проверки выйграл кто-то из игроков или нет.
 * В случае выйгрыша или проигрыша, записывается лог и игра завершается
 * Если же нет, то запускается функция callback
 *
 * @param {string} player Передаем кого проверяем, компьютер или игрока
 * @param {number} score Количество очков
 * @param {function} callback Количество очков
 * @return {string} console.log Сообщение о выйгрыше или проигрыше
 */
function checkWin(player, score, callback) {
  if (score === 21) {
    console.log(`${player} WIN co счетом - ${score}`);
    rl.close();
    return writeLog('./log/log_BJ.txt', `WIN. ${player} выйграл co счетом - ${score}\n`);
  }
  if (score > 21) {
    console.log(`${player} LOSE co счетом - ${score}`);
    rl.close();
    return writeLog('./log/log_BJ.txt', `LOSE. ${player} проиграл co счетом - ${score}\n`);
  } else {
    console.log(`Ваши очки - ${score}`);
    callback();
  }
}

// Компьютер "решает" (с помощью функции coinToss()) брать ему карты или нет.
// Если берет - запускаем проверку на выйгрыш, если нет - выходим из функции.
function playingComputer() {
  if (coinToss()) {
    console.log('Компьютер берет карты');
    scoreComp += getCard(CART_COLLECTION);
    return checkWin('Компьютер', scoreComp, playingComputer);
  }
  return console.log('Комп больше не берет карты');
}

/**
 * Подсчет если ранее никто не выйграл и не проиграл
 * В случае выйгрыша или проигрыша, записывается лог и игра завершается
 * Если же нет, то запускается функция callback
 *
 * @param {number} scoreUser Очки игрока
 * @param {number} scoreComp Очки компьюетра
 * @return {string} console.log Сообщение о выйгрыше или проигрыше
 */
function scoring(scoreUser, scoreComp) {
  console.log(`Ваши очки - ${scoreUser}, очки компьютера - ${scoreComp}`);

  if ((scoreComp > 21) || (scoreUser > scoreComp)) {
    console.log(`Вы WIN со счетом ${scoreUser}`);
    rl.close();
    return writeLog('./log/log_BJ.txt', `WIN. Вы выграли со счетом ${scoreUser}, очки компьютера - ${scoreComp}\n`);
  } else {
    console.log(`Вы LOSE со счетом ${scoreUser}`);
    rl.close();
    return writeLog('./log/log_BJ.txt', `LOSE. Вы проиграли со счетом ${scoreUser}, очки компьютера - ${scoreComp}\n`);
  }
}

// Функция, которая возвращает true или false в случайном порядке. 
// В зависимости от этого, компьютер берет карты или нет
function coinToss() {
  return (Math.floor(Math.random() * 2) === 0);
}
