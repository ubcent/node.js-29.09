const rl = require ('readline').createInterface({input: process.stdin, output: process.stdout});

function appRender () {
  rl.question(
    `\n \nThis app can show you news or translate your word! \n
    To see some news from TJ -> 1 \n
    Translate the word -> 2 \n
    Exit -> Ctrl+C \n`, (answ) => {
    switch (answ) {
      case '1': 
        require('./news')
        break
      case '2': 
        require('./translate')
        break
      default: 
        appRender()
    }
  })
}

appRender()