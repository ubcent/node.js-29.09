const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const passportGithubStrategy = require('passport-github').Strategy;

const TodoList = require('./helpers/todolist')
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useCreateIndex: true });
const GitHubApiCredentials = require('./github_api_keys');

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.static('./public'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const githubAuthUrl = '/login/github';
const githubCallbackUrl = '/login/github/callback';

passport.use('github', new passportGithubStrategy({
    clientID: GitHubApiCredentials.GithubClientId,
    clientSecret: GitHubApiCredentials.GitHubClientSecret,
    callbackURL: githubCallbackUrl,
  }, 
  function(accessToken, refreshToken, profile, done) {
    const user = {username: profile.username};
    return done(null, user);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login-github.html');
});

app.get(githubAuthUrl, passport.authenticate('github'));

app.get(githubCallbackUrl, passport.authenticate('github', {
  failureRedirect: '/login',
  successRedirect: '/todo',
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