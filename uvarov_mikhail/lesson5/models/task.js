const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'yii2',
  user: 'yii2',
  password: '123',
});

class Task {
	
  static getAll() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
     	  reject(err);
     	}
     	connection.query('SELECT * FROM `task`', (err, rows) => {
     	  connection.release();
     	  if(err) {
     	    reject(err);
     	  }
     	  console.log(rows);
     	  resolve(rows);   
     	});
      });
    });
  }
  
  static add(task) {
	  
  }
}


module.exports = Task;