const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const session = require('express-session')
const path = require('path');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

const Task = require('./models/task');
const User = require('./models/user');
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useCreateIndex: true });

class TodoList{
  static async addTask(name){
    await (new Task({name})).save();
  }

  static async deleteTask(id){
    await Task.deleteOne({_id : id});
  }
  
  static async markTaskDone(id){
    await Task.updateOne(
      {_id: id}, 
      {$set: {done: true, updatedAt: new Date()}}
    );
  }

  static async markTaskUndone(id){
    await Task.updateOne(
      {_id: id}, 
      {$set: {done: false, updatedAt: new Date()}}
    );
  }

  static async getTasks(){
    const tasks = await Task.find();
    return tasks;
  }
}

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.static('./public'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    if(username !== 'admin'){
      return done(null, false);
    }
    if(password !== 'a'){
      return done(null, false);
    }
    return done(null, {username});
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/todo',
  failureRedirect: '/login',
}));

const mustBeAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

app.get('/todo', mustBeAuthenticated, async (req, res) => {
  const tasks = await TodoList.getTasks();
  res.render('todolist', {
    user: req.user.username,
    tasks: JSON.stringify(tasks),
  });
});

app.post('/todo', mustBeAuthenticated, async (req, res) => {
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
    req.logout();
    res.redirect('/');
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