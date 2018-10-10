const stats = require('../stats.json')
const log = console.log

function renderWins () {
    let last_id = 0
    let win_streak = 1

    stats.wins.map((id, key) => {
        if (stats.wins[key+1] == id + 1){

            if (id != last_id + 1){
                win_streak = 1
            }

            last_id = id
            win_streak++
        }
    })
    return win_streak
}

function renderLooses () {
    let last_id = 0
    let loose_streak = 1

    stats.looses.map((id, key) => {
        if (stats.looses[key+1] == id + 1){

            if (id != last_id + 1){
                loose_streak = 1
            }

            last_id = id
            loose_streak++
        }
    })
    return loose_streak
}

function renderDraws () {
    let last_id = 0
    let draw_streak = 1

    stats.draws.map((id, key) => {
        if (stats.draws[key+1] == id + 1){

            if (id != last_id + 1){
                draw_streak = 1
            }

            last_id = id
            draw_streak++
        }
    })
    return draw_streak
}

log(`\n 
    Total number of games: ${stats.game_id}; \n
    Longest win streak: ${renderWins()}; \n
    Longest loose streak: ${renderLooses()}; \n
    Longest draw streak: ${renderDraws()}; \n
    To menu -> Ctrl + C`)