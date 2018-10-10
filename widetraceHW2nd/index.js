require('./app/index')
const fs = require('fs')
const stats = 'stats.json'


fs.access(stats, fs.constants.F_OK, (err) => {
    if (err) {
        fs.writeFileSync(stats, '{"game_id": 0, "wins": [], "looses": [], "draws": []}')
    }
})
