const request = require('request');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/users', { useNewUrlParser: true });
mongoose.connection.on('open', function(){
  console.log('Приконектился к Mongo!');
});
const User = require('./models/usersNew');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(cookieParser());
app.use(cookie({ keys: ['secret'] }));

app.use(bodyParser.urlencoded({extended: false}));

// мидлвара, которая кладет в объект req.user авторизованного пользователя
//но мы это делаем только в случае срабатывания If, если есть что-то в сессии
app.use((req, res, next) => {
  if(req.session.user){
    req.user = req.session.user;
  }
  next();
});

app.get('/auth', (req, res) => {
  res.render('formauth2.hbs');
});

app.post('/auth', async (req, res) => {
  const {username, password} = req.body;

  const user = await User.findOne({username, password});
    if(user){
      req.session.user = user;
      res.redirect('/user');
    } else {
      res.redirect('/auth');
      console.log('Неверный пароль или логин, повторите ввод');
    }
});

const mustbeAuthenticated = (req, res, next) => {
  if(req.user) {
    next();
  } else {
    res.redirect('/auth');
  }
}

app.all('/user', mustbeAuthenticated);
app.all('/user/*', mustbeAuthenticated);

app.get('/user', (req, res) => {
  res.send('Пользователь с логином: ' + req.user.username + ' -авторизовался');
});

app.listen(3000);