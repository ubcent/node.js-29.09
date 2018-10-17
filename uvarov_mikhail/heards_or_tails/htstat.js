'use strict';

const fs = require('fs');

/** Класс бработки и хранения статистики 
 *  игры headsOrTails
 * @class HtStat
 * @author Uvarov Mikhail
 */
module.exports = class HtStat {
	
  constructor() {
    this.path = './htstat.json';
    this.get();
  }
	
  get() {
	let data = fs.readFileSync(this.path);
		
	if (data.length > 0) {
	  this.stat = [];
	  let temp = JSON.parse(data);
	  for (let i = 0; i < temp.length; i++) {
		this.stat.push(new User(temp[i].login, temp[i].games, temp[i].win))
	  }
			
	} else {
	  this.stat = [];
	}
		
		
	if (this.stat == 'undefined')
	  this.stat = [];
  }
	
  /**
   * Метод update - обновляем статистику пользователя
   * @param {string} login - имя пользователя, стаистику которого обновляем
   * @param {bool} win - с каким результатом пользователь закончил игру
   */
  update(login, win) {
    if (login.length > 0) {
	  win = win?1:0;	
			
	  let item = this.userInStat(login);
	  if (item >= 0) {
		this.stat[item].update(win);
	  }
	  else {
		this.stat.push(new User(login, 1, win));
	  }
			
			
	  this.save();
	}
  }
	
  save() {
		
    try {
	  //console.log(this.stat)
	  let data = JSON.stringify(this.stat);
	  //console.log(data)
	  fs.writeFileSync(this.path, data);
      //console.log('File has been written successfully');
    } catch (err) {
      console.log('Error in writing file');
      console.log(err);
    }
  }
	
  show(login = '') {
    if (login.length > 0) {
	  let item = this.userInStat(login);
	  if (item >= 0) {
	    console.log(login + 
	        ' рекорд: ' + 
			this.stat[item].games + 'И ' +
			this.stat[item].win + 'В ' +
			(this.stat[item].games - this.stat[item].win) + 'П');
	  } else {
	    console.log('Пользователя с именем ' + login + ' не существует');
	  }
	} else {
	  // считаем полную статистику матча
	  let players = this.stat.length;
	  let games = 0;
	  let wins = 0;
			
	  for (let i = 0; i < players; i++) {
		wins += this.stat[i].win;
		games += this.stat[i].games;
	  }
			
	  console.log('Игороков: ' + players + ' -> ' +
		  games + 'И ' +
		  wins +'В ' +
		  (games - wins)+ 'П');
	}
		
  }
	
  userInStat(login) {
    let result = -1;
    for (let i = 0; i < this.stat.length; i++) {
	  if (this.stat[i].login == login) {
	    result = i;
		break;
	  }
	}
	return result;
  }
}

class User {
  constructor(login, games, win) {
    this.login = login;
    this.games = games;
	this.win = win;
  }
	
  update (win) {
    this.win += (win?1:0);
    this.games++;
  d}
}