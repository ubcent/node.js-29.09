const request = require('request');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/todo', { useNewUrlParser: true });
mongoose.connection.on('open', function(){
  console.log('Приконектился к Mongo!');
});

app.use(bodyParser.json());
app.use(express.static('./test'));

const Task = require('./models/todoModel');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/todo', async (req, res) => {
  const taskAll = await Task.find();
  res.render('todoNew.hbs', {name_task: taskAll}); 
});

app.post('/todo', async (req, res) => {
  const { status } = req.body;

  const endTask = await Task.find({status:{$eq:"завершена"}});
  if(endTask) {
    res.render('todoNew.hbs', {status: endTask})
  } else {
    res.json({ error: 'поиск статуса осуществляется вводом слова: "завершена"' });
  }
});

app.post('/todo/not', async (req, res) => {
  const { status } = req.body;
  const NotEndTask = await Task.find({status:{$eq:"не завершена"}});
  if(NotEndTask) {
    res.render('todoNew.hbs', {status_not: NotEndTask})
  } else {
    res.json({ error: 'все задачи решены или ошибка в базе данных' });
  }
});

//то что ниже все работает через rest api, буду переводить в браузер
//после того как переведу в браузер, буду уже переделывать на socket.io
app.get('/todo/:id', async (req, res) => {
  const taskOne = await Task.findById(req.params.id);
  res.json(taskOne); 
});

app.post('/taskCreate', async (req, res) => {
  let newtask = new Task(req.body);
  newtask = await newtask.save();
  if(newtask){
    res.json(`Добавлен ${newtask}`)
  } else {
    res.json({code: 1, message: 'Wrong syntax or error json'});
  }
});

app.patch('/updateTask', async (req, res) => {
  const {number} = req.body;
  const updatetask = await Task.update(req.params.number, { $set: {status:"завершена"} });

  res.json(updatetask);
});

app.listen(3000);

