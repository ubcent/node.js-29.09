/**
 * Функция раздачи карт
 * В случае выйгрыша или проигрыша, записывается лог и игра завершается
 * Если же нет, то запускается функция callback
 *
 * @param {object} data Массив с колодой карт
 * @param {string} player Кто играет - не обязятельный параметр
 * @return {number} score Возвращаем подсчитанное количество очков
 */
export default function getCard(data, player) {
  const card = data[Math.floor(Math.random() * data.length)];
  let score = 0;

  if ((card === 'Король') || (card === 'Дама') || (card === 'Валет')) {
    score += 10;
  } else if ((card === 'Туз')) {
    score = score + 11;
  } else {
    score += +card;
  }

  if (player) {
    console.log('Вам раздали такие карты - ', card);
  }

  return score;
}
