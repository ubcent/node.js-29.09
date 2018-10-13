const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class CardDeck {
  constructor() {
    this.suit = ['\u2660', '\u2663', '\u2665', '\u2666'];
    this.names = [
      {name: 'Двойка', value: 2},
      {name: 'Тройка', value: 3},
      {name: 'Четверка', value: 4},
      {name: 'Пятерка', value: 5},
      {name: 'Шестерка', value: 6},
      {name: 'Семерка', value: 7},
      {name: 'Восмерка', value: 8},
      {name: 'Девятка', value: 9},
      {name: 'Десятка', value: 10},
      {name: 'Валет', value: 10},
      {name: 'Дама', value: 10},
      {name: 'Король', value: 10},
      {name: 'Туз', value: 11},
    ];
    this.cards = new Map();

    this.generateCardDeck();
  }

  generateCardDeck() {
    for (let i = 0, id = 0; i < this.suit.length; i++) {
      for (let j = 0; j < this.names.length; j++) {
        this.cards.set(id++, {
          suit: this.suit[i],
          name: this.names[j].name,
          value: this.names[j].value,
        });
      }
    }
  }

  checkDeck() {
    if (!this.cards.size) {
      console.log('Колода закончилась');
      process.exit();
    }
  }

  get card() {
    let rand = Math.floor(Math.random() * 52);

    if (this.cards.has(rand)) {
      let getCard = this.cards.get(rand);
      this.cards.delete(rand);
      return getCard;
    } else {
      this.checkDeck();
      this.card;
    }
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.value = 0;
  }

  get cardsValue() {
    return this.value;
  }

  set cardValue(value) {
    this.value += value;
  }
}

class Game {
  constructor(player, diller, cardDeck) {
    this.player = player;
    this.diller = diller;
    this.cardDeck = cardDeck;
  }

  start() {
    console.log('\u2660 \u2666 BlackJack \u2665 \u2663\n\nПервая раздача');
    console.log('------------');

    this.playerGetCard(this.diller);
    this.playerGetCard(this.player);
    this.playerGetCard(this.player);

    this.playerGame();
  }

  playerGetCard(player) {
    let {suit, name, value} = this.cardDeck.card;
    player.cardValue = value === 11 && player.cardsValue > 10
        ? 1
        : value;

    console.log(
        `У ${player.name}а "${suit} ${name}". Баллов - ${player.cardsValue}`);

    if (player.cardsValue > 21) {
      return this.finish();
    }
  }

  playerGame() {
    console.log('------------\n');

    rl.question('Взять еще карту? (Да/Нет)\n', (answer) => {
      if (answer === 'Да') {
        this.playerGetCard(this.player);
        if (this.player.cardsValue <= 21) {
          this.playerGame();
        }
      } else if (answer === 'Нет') {
        this.dillerGame();
      } else {
        this.playerGame();
      }
    });
  }

  dillerGame() {
    console.log(`\nИграет ${this.diller.name}`);
    console.log('------------');

    while (this.diller.cardsValue < 17 && this.diller.cardsValue !== 17) {
      this.playerGetCard(this.diller);
    }

    if (this.diller.cardsValue <= 21) {
      return this.finish();
    }
  }

  finish() {
    console.log('------------\n');
    let winner;

    if (this.player.cardsValue > this.diller.cardsValue &&
        this.player.cardsValue <= 21 || this.diller.cardsValue > 21) {
      winner = 'player';
      console.log(`${this.player.name} победил`);
    } else if (this.player.cardsValue === this.diller.cardsValue) {
      console.log('Ничья');
    } else {
      console.log(`${this.diller.name} победил`);
    }

    this.saveStat(winner);

    return rl.close(), process.stdin.destroy();
  }

  saveStat(winner) {
    fs.readFile('./stat.json', (err, data) => {
      let dataParse;

      if (err) return console.error(err);

      try {
        dataParse = JSON.parse(data);
      } catch (err) {
        return console.error(err);
      }
      let {games, playersWin, dillerWin} = dataParse;

      games++;

      if (winner === 'player') {
        playersWin++;
      } else {
        dillerWin++;
      }

      let saveObj = {games, playersWin, dillerWin};

      fs.writeFile('./stat.json', JSON.stringify(saveObj), (err) => {
        if (err) return console.error(err);
        this.getStat();
      });
    });
  }

  getStat(print = true) {
    fs.readFile('./stat.json', (err, data) => {
      let dataParse;

      if (err) return console.error(err);

      try {
        dataParse = JSON.parse(data);
      } catch (err) {
        return console.error(err);
      }

      if (print) {
        const {games, playersWin, dillerWin} = dataParse;
        const rating = playersWin / games * 100;

        console.log('\n------------');
        console.log('Статистика:');
        console.log(
            `Игр сыграно: ${games}\n Казино выиграло: ${dillerWin}\n Игроки выиграли: ${playersWin}\n Рейтинг игроков: ${rating.toFixed(1)}%\n`
        );
      }
    });
  }
}

const cardDeck = new CardDeck();
const player = new Player('Игрок');
const diller = new Player('Диллер');

const game = new Game(player, diller, cardDeck);
game.start();

