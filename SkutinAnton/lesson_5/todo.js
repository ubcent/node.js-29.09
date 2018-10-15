const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true }, err => {
  console.log('Успешное подключение');
});
const Task = require('./models/task');

const app = express();

app.engine('hbs', consolidate.handlebars);

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const todoList = await Task.find();
  res.render('list', {
    todoList
  })
});

app.post('/', async (req, res) => {
  Task.create({ name: req.body.task })
  const todoList = await Task.find();
  res.render('list', {
    todoList
  })
});

app.delete('/', async (req, res) => {
  Task.findOneAndDelete({ _id: req.body.id }, async (err, deleteTask) => {
    const todoList = await Task.find();
    res.render('list', {
      todoList
    })
  });
});

app.listen(3000);