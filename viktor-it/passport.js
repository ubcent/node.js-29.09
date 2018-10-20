const request = require('request');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/users', { useNewUrlParser: true });
mongoose.connection.on('open', () => {
  console.log('Приконектился к Mongo!');
});
const usersDB = require('./models/users');

const app = express();
app.use(cookieParser());
app.use(session({ keys: ['secret'] }));

app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.json());

// 1 этап - настройка паспорта
passport.use(new LocalStrategy((username, password, done) => {
  
  usersFromDb.findOne({username, password}).then((user) => {
  	if (!user) {
  	  done(null, false)
  	} else {
  	  done(null, user);
  	}
  });
}));

// 2 этап - создание обработчика для роута при помощи паспорта
app.get('/auth', (req, res) => {
  res.render('formauth.hbs');
});

const authHandler = passport.authenticate('local', {
  succesRedirect: '/users',
  failureRedirect: '/failure'
});

// отображаем данные пользователей из базы Mongo
app.get('/usersMongo', async (req, res) => {
  const usersFromDb = await usersDB.find();
  res.json(usersFromDb);
});

app.get('/users', (req, res) => {
  res.render('user.hbs', {
    userName: 'User page'
  });
});

app.get('/failure', (req, res) => {
  res.render('failure.hbs', {
    failure: 'failure!!!'
  });
});

app.post('/auth', authHandler);

const mustBeAuthenticated = (req, res, next) => {
  if(req.users){
  	next();
  } else {
  	res.redirect('/auth');
  }
};

app.all('/users', mustBeAuthenticated);
app.get('/users', (req, res) => {
  res.send('Привет ты авторизовался, поздравляем!!!');
});

app.listen(3000);