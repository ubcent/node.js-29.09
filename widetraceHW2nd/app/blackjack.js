const rl = require('readline').createInterface({input: process.stdin, output: process.stdout})
const num = require('./randomNumber')
const log = console.log 
const stats = require('../stats.json')
const fs = require('fs')
const cards = require('./bjNumbers.json')

let playerSum = 0
let compSum = 0
const playerHand = []
const compHand = []

function game () {
    stats.game_id = stats.game_id + 1
    log('Hey! You choose popular game "BlackJack"!')
    gameStart()
}

function gameStart () {
    compHand.push(num.randNum(cards.numbers[0], cards.numbers[cards.numbers.length - 1]))
    compSum = compSum + compHand[compHand.length-1]
    if (!playerHand.length){
        playerHand.push(num.randNum(cards.numbers[0], cards.numbers[cards.numbers.length - 1]))
        playerSum = playerSum + playerHand[playerHand.length-1]
        log(`You and computer take first cards. Your card cost: ${playerHand[0]}`)
    }
    takeCards()
}
    
function takeCards(){
    rl.question(`\n Check your cards - 1 \n
    Take another card? - 2 \n
    End game - 3 \n`, 
    answ => {
        let answer = parseInt(answ)
        if (answer == 1 ){

            log(`Your cards values: ${playerHand} \n
            Summary of your cards is: ${playerSum} \n`)
            
            takeCards()
            
        } else if (answer == 2){

            if (compSum <= 18){
                compHand.push(num.randNum(cards.numbers[0], cards.numbers[cards.numbers.length -1]))
                compSum = compSum + compHand[compHand.length-1]
                if (compSum > 21){
                    win()
                } 
            }

            playerHand.push(num.randNum(cards.numbers[0], cards.numbers[cards.numbers.length - 1]))
            playerSum = playerSum + playerHand[playerHand.length-1]

            log(`You take card with value ${playerHand[playerHand.length-1]}`)

            if (playerSum > 21){
                loose()
            } else takeCards()

        } else if (answer == 3) {
            if (playerSum > compSum){
                win()
            }else if (playerSum == compSum){
                log(`It's draw!`)

                fs.writeFileSync('./stats.json', JSON.stringify(stats))
            } else loose()
        } else takeCards() 
        
    })
}

function win() {
    log(`\n You win! \n
        Exit -> Ctrl + C \n`)
    stats.wins.push(stats.game_id)
    fs.writeFileSync('./stats.json', JSON.stringify(stats))
}

function loose(){
    log(`\n You loose :( \n
        Exit -> Ctrl + C \n`)
    stats.looses.push(stats.game_id)
    fs.writeFileSync('./stats.json', JSON.stringify(stats))
}

function draw(){
    log(`\n It's draw! \n
        Exit -> Ctrl + C \n`)
    stats.draws.push(stats.game_id)
    fs.writeFileSync('./stats.json', JSON.stringify(stats))
}

game()
