const request = require('request');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

const Task = require('./models/task');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));


const task = [
  {id: '4', name_task:'Тестовый Insert в нашу БД', start_task:'2018-10-17 02:00:41', end_task:'2018-10-17 03:01:41', control_task:'1'}
];

app.get('/todo', (req, res) => {
Task.getAll().then((rows) => {
    return rows;
  }).then((rows) => {
    res.render('todo.hbs', {name:rows});
  })
});

app.post('/todo', (req, res) => {
  const {control_task = 1} = req.body;	
  Task.getFinishTask().then((rows) => {
    return rows;
    }).then((rows) => {
      res.render('todo.hbs', {
      	control_task: rows,
      });
    })
});

app.post('/todo', (req, res) => {
  const {task} = req.body;	
  Task.addTask().then((result) => {
    return result;
    console.log(result);
    }).then((result) => {
      res.render('todo.hbs', {
      	task: result,
      });
    })
});

app.listen(3000);