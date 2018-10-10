const rl = require('readline').createInterface({input: process.stdin, output: process.stdout})
const num = require('./randomNumber')
const log = console.log 
const stats = require('../stats.json')
const fs = require('fs')

function game (num) {
    stats.game_id = stats.game_id + 1
    if (num == 1 || num == 0){
        log('Hey! You choose popular game "Heads or Tails"!')
        gameStart(num)
    }
    else log ('Something goes wrong with the game, please restart!')
}

function gameStart (num) {
    rl.question(`Choose your side! (Heads - 0; Tails - 1) \n`, answ => {
        let answer = parseInt(answ)
        if (answer == 0 || answer == 1){
            log (`Flip coin!`)
            log(`It's ${num === 0 ? 'Heads' : 'Tails'}`)
            if (num == answer){
                log(`Hey, you win!`)
                log(`Exit -> Ctrl + C`)
                stats.wins.push(stats.game_id)
                // process.exit()
            } else {
                console.error (`Sorry, you lose :c`)   
                log(`Exit -> Ctrl + C`)
                stats.looses.push(stats.game_id) 
                // process.exit()
            }
            fs.writeFileSync('./stats.json', JSON.stringify(stats))
        } else gameStart()  
        
    })
}

game(num.randNum(0,1))



