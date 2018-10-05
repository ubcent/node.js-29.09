const cards = require('./cards');
const fs = require('fs');

class Game {

  constructor(cards) {
    this.cards = cards;
    this.newCards;
    this.userCards;
    this.userCardsSum;
    this.dealerCardsSum;
  }

  createCards() {
    this.newCards = [...this.cards.other, ...this.cards.picture, this.cards.ace];
  }

  getDealerCardsSum() {
    this.dealerCardsSum = Math.floor(Math.random() * (26 - 15)) + 15;
  }

  getOneCard() {
    const randomNumber = Math.round(Math.random() * 12)
    const card = this.newCards[randomNumber]

    this.userCards.push(card);
  }

  getTwoCard() {
    let twoCards = [];

    for (let i = 0; i < 2; i++) {
      const randomNumber = Math.round(Math.random() * 12)
      const card = this.newCards[randomNumber]
      twoCards.push(card);
    }

    this.userCards = twoCards;
  }

  getCardsPoint() {
    let sum = 0;

    this.userCards.forEach(card => {
      if (game.cards.picture.includes(card)) {
        sum = sum + 10;
      } else if (card === game.cards.ace && sum <= 10) {
        sum = sum + 11;
      } else if (card === game.cards.ace && sum > 10) {
        sum = sum + 1;
      } else {
        sum = sum + card;
      }
    });

    this.userCardsSum = sum;
  }

  getResultGame() {
    if (this.dealerCardsSum > 21 && this.userCardsSum > 21) {
      console.log(`Вы оба проиграли! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
      fs.appendFileSync('./blackjack-result.txt', `\nВы оба проиграли! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
    } else if (this.dealerCardsSum === 21 && this.userCardsSum === 21) {
      console.log(`Вы оба выиграли! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
      fs.appendFileSync('./blackjack-result.txt', `\nВы оба выиграли! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
    } else if (this.dealerCardsSum > 21) {
      console.log(`Вы победили! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
      fs.appendFileSync('./blackjack-result.txt', `\nВы победили! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
    } else if (this.userCardsSum > 21) {
      console.log(`Выиграл Дилер! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
      fs.appendFileSync('./blackjack-result.txt', `\nВыиграл Дилер! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
    } else if (this.dealerCardsSum > this.userCardsSum ) {
      console.log(`Выиграл Дилер! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
      fs.appendFileSync('./blackjack-result.txt', `\nВыиграл Дилер! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
    } else if (this.dealerCardsSum < this.userCardsSum ) {
      console.log(`Вы победили! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
      fs.appendFileSync('./blackjack-result.txt', `\nВы победили! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
    } else if (this.dealerCardsSum === this.userCardsSum ) {
      console.log(`У вас ничья! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
      fs.appendFileSync('./blackjack-result.txt', `\nУ вас ничья! Ваши очки: ${this.userCardsSum}. Очки Дилера: ${this.dealerCardsSum}`);
    }
  }
}

const game = new Game(cards);

module.exports = game;