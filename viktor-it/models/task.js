"use strict";
const mysql = require('mysql');

const pool = mysql.createPool({
  host:'localhost',
  port:'3306',
  database:'todo',
  user:'root',
  password:'password'
});

class Task {
  static getAll(){
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
        connection.query('SELECT * FROM `tasks`', (err, rows) => {
          connection.release();
          if(err) {
            reject(err);
          }
          resolve(rows);
        });
      });
    });
  }
  static addTask(task){
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
        connection.query('INSERT INTO `tasks` SET ?', task, (err, result) => {
          connection.release();
          if(err) {
            reject(err);
          }
          resolve(result);
        });
      });
    });
  };
  static getFinishTask(){
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if(err) {
          reject(err);
        }
        connection.query('SELECT * FROM `tasks` WHERE control_task = 1', (err, rows) => {
          connection.release();
          if(err) {
            reject(err);
          }
          resolve(rows);
        });
      });
    });
  };
};

module.exports = Task;