const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');

const User = require('./models/user');
const TodoList = require('./helpers/todolist')
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useCreateIndex: true });

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static('./public'));
app.use(cookieParser());
app.use(session({keys: ['secret']}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  if(req.session.user){
    req.user = req.session.user;
  }
  next();
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
})

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({name: username});
  if(!user) {
    return res.redirect('/login');
  }
  const correct = await user.checkPassword(password);
  if(!correct) {
    return res.redirect('login');
  }
  req.session.user = user;
  res.redirect('/todo');
});

const authorizationNeeded = (req, res, next) => {
  if(!req.user){
    return res.redirect('/login');
  }
  next();
}

app.get('/todo', authorizationNeeded, async (req, res) => {
  const tasks = await TodoList.getTasks();
  res.render('todolist', {
    user: req.user.name,
    tasks: JSON.stringify(tasks),
  });
});

app.post('/todo', authorizationNeeded, async (req, res) => {
  if(req.body.action === 'logout'){
    req.session.user = null;
    return res.redirect('/login');
  } else if(req.body.action === 'newTask'){
    await TodoList.addTask(req.body.name);
  } else if(req.body.action === 'deleteTask'){
    await TodoList.deleteTask(req.body.id);
  } else if(req.body.action === 'taskDone'){
    await TodoList.markTaskDone(req.body.id);
  } else if(req.body.action === 'taskUndone'){
    await TodoList.markTaskUndone(req.body.id);
  } else {
    return res.send('Error: incorrect request');
  } 
  
  const tasks = await TodoList.getTasks();
  res.setHeader('Content-Type', 'application/json');
  res.send(tasks);
});

app.use((req, res, next) => {
  res.status(404).send("404: Not found")
});

app.listen(3000);