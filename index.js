  var fs = require('fs');
  var readline = require('readline');
  var argv = require('minimist')(process.argv.slice(2));
  var _ = require('lodash');

  var rl = readline.createInterface({
    input: process.stdin, // ввод из стандартного потока
    output: process.stdout // вывод в стандартный поток
  });

  var index = 0;

  function init() {
    if(!argv.stat) {
      askQuestion();
      initJson();
    } else {
      getStat();
    }
  };

  function getStat() {
    fs.readFile(argv.file, (err, readData) => {
      if (err) throw err;
      
      var bigData = _.get(JSON.parse(readData), 'data', []);

      var totalGames = bigData.length;
      var winGames = _.filter(bigData, {res: true}).length;
      var looseGames = _.filter(bigData, {res: false}).length;
      var win_loos = winGames / looseGames;
      var maxWinLine = 0;
      var winLine = 0;
      var maxLooseLine = 0;
      var looseLine = 0;
      _.forEach(bigData, (game)=>{
        if(game.res) {
          winLine ++;
          looseLine = 0;
        }
        if(!game.res) {
          looseLine ++;
          winLine = 0;
        }
        if(winLine > maxWinLine) {
          maxWinLine = winLine;
        }
        if(looseLine > maxLooseLine) {
          maxLooseLine = looseLine;
        }
      })
      
      console.log('общее количество партий', totalGames);
      console.log('количество выигранных', winGames);
      console.log('проигранных партий',looseGames);
      console.log('соотношение выигранные/проигранные', win_loos);
      console.log('максимальное число побед подряд', maxWinLine);
      console.log('максимальное число проигрышей подряд', maxLooseLine);

    });
  }
  
  function initJson() {
    if(argv.file) {
      fs.writeFile(argv.file, JSON.stringify({data:[]}), (err)=> {
        if (err) throw err;
      });
    }
  }

  function logger(data) {
    fs.readFile(argv.file, (err, readData) => {
      if (err) throw err;

      var stat = JSON.parse(readData);
      stat.data.push(data);
      jsonStat = JSON.stringify(stat);

      if(argv.file) {
        fs.writeFile(argv.file, jsonStat, (err)=> {
          if (err) throw err;
        });
      }
    });
  }

  function askQuestion() {
    console.log('Как думаете 1 или 2? Введите и нажмите Enter');
  };

  function compAnswer() {
    if( Math.random()>0.5 ) {
      return '2';
    }    
    return '1';
  }

  function checkAnswer(userAnswer, compAnswer) {
    var res = userAnswer === compAnswer;
    var data = {
      index,
      compAnswer,
      userAnswer,
      res
    };
    logger(data);
    return res;
  }

  rl.on('line', function (cmd) {
    var res = checkAnswer(cmd, compAnswer());
    var result = res ? 'Угадали!' : 'Попробуйте еще раз ;)';
    console.log(result);
    index++;
    askQuestion();
  });


  init();
