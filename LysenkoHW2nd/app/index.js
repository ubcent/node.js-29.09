const num = require ('./randomNumber')
const rl = require ('readline').createInterface({input: process.stdin, output: process.stdout})
const log = console.log
const cards = require('./bjNumbers.json')

function startPlaying () {
    rl.question(
        `\n In what game do you want to play? \n
        Heads or Tails - 1 \n
        BlackJack - 2 \n
        Stats - 9 \n
        Exit - Ctrl+C \n`, (answ) => {
    answ = parseInt(answ)
    if (answ == 1) {
        require('./headsOrTails')
    } else if (answ == 2) {
        require('./blackjack')
    } else if (answ == 9){
        log('--- STATISTICS ---')
        require('./statsRender')
        
    } else startPlaying()
})
    // process.on('beforeExit', startPlaying)
}

startPlaying();


// log(stats.game_id)

// log(num.randNum(0, 1))