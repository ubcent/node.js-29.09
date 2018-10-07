const readline = require('readline');
const game = require('./game');
const text = require('./text');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// начало игры
text.start();
game.createCards();
game.getTwoCard();
text.whatCardsInHands();
game.getCardsPoint();
text.whatSum();

if (game.userCardsSum < 21) {
  text.elseCard();
  rl.on('line', (answer) => {
    if (answer.toLowerCase() === 'да' || answer.toLowerCase() === 'lf') {
      game.getOneCard();
      text.whatCardsInHands();
      game.getCardsPoint();
      text.whatSum();

      if (game.userCardsSum >= 21) {
        dealerStep();
      } else {
        text.elseCard();
      }

    } else {
      dealerStep();
    }
  });
} else {
  dealerStep();
}

const dealerStep = () => {
  rl.close();
  text.whaitDealer();
  game.getDealerCardsSum();
  game.getResultGame();
}