const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./Config');
const Todo = require('./Todo');

const app = express();

app.set('view engine', 'pug');

mongoose.connect(config.DB, { useNewUrlParser: true }, err => {
  if (err) console.log('Ошбика подключения БД');
});

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Начало работы'
  });
});

// Отобразить все задачи
app.get('/todoList', async (req, res) => {
  const todos = await Todo.find();
  res.render('todoList', {
    todos
  });
});

// Добавить задачу
app.post('/add', (req, res) => {
  Todo.create({ title: req.body.item });
  res.redirect('/todoList');
});

// Удалить задачу
app.post('/delete', (req, res) => {
  Todo.deleteOne({ _id: req.body._id }, err => {
    if (err) console.log('Ошбика БД, задачу не удалили');
    res.redirect('/todoList');
  });
});

// Редактировать задачу
app.post('/edit', (req, res) => {
  Todo.findOneAndUpdate({ _id: req.body._id }, { $set: { title: req.body.title } }, err => {
    if (err) console.log('Ошбика БД, задачу не обновили');
    res.redirect('/todoList');
  });
});

// Изменить статус задачи
app.post('/updateDone', (req, res) => {
  Todo.findOneAndUpdate({ _id: req.body._id }, { $set: { done: req.body.done } }, err => {
    if (err) console.log('Ошбика БД, статус задачи не обновлен');
    res.redirect('/todoList');
  });
});

app.listen(config.APP_PORT, () => console.log('server work'));
