const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

const User = require('./models/user');
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useCreateIndex: true });
const TodoList = require('./helpers/todolist')

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  key: 'user_sid',
  secret: 'randomsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
  },
}));

app.use((req, res, next) => {
  if(req.cookies.user_sid && !req.session.user){
    res.clearCookie('user_sid');
  }
  next();
});

app.get('/login', (req, res) => {
  if(req.session.user && req.cookies.user_sid){
    res.redirect('/todo');
  } else {
    res.sendFile(__dirname + '/public/login.html');
  }
});

app.post('/login', (req, res) => {
  let username = req.body.username, password = req.body.password;
  User.findOne({name: username}).then((user) => {
    if(!user){
      res.redirect('/login');
      return;
    } 
    user.checkPassword(password, (correct) => {
      if(!correct){
        res.redirect('/login');
      }
      else{
        req.session.user = {username};
        res.redirect('/todo');
      }
    });
  });
});

app.get('/todo', async (req, res) => {
  if(req.session.user && req.cookies.user_sid){
    const tasks = await TodoList.getTasks();
    res.render('todolist', {
      user: req.session.user.username,
      tasks: JSON.stringify(tasks),
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/todo', async (req, res) => {
  if(req.body.action === 'newTask'){
    await TodoList.addTask(req.body.name);
  } 
  else if(req.body.action === 'deleteTask'){
    await TodoList.deleteTask(req.body.id);
  }
  else if(req.body.action === 'taskDone'){
    await TodoList.markTaskDone(req.body.id);
  }
  else if(req.body.action === 'taskUndone'){
    await TodoList.markTaskUndone(req.body.id);
  }
  else if(req.body.action === 'logout'){
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
    } 
    res.redirect('/login');
    return;
  }

  const tasks = await TodoList.getTasks();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(tasks));
});

app.use(function (req, res, next) {
  res.status(404).send("404: Not found")
});

app.listen(3000);