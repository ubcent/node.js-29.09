const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

const TodoList = require('./helpers/todolist')
const User = require('./models/user');
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useCreateIndex: true });

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
  async (username, password, done) => {
    const user = await User.findOne({name: username});
    if(!user) {
      return done(null, false);
    }
    const correctPassword = await user.checkPassword(password);
    if(!correctPassword) {
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
  if(req.body.action === 'logout'){
    req.logout();
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