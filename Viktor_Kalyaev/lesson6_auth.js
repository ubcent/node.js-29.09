var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
require('./todo.js')();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
const Todo = mongoose.model('Todo');

passport.use(new Strategy(
  function (username, password, cb) {
    db.users.findByUsername(username, function (err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  function (req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function (req, res) {
    res.render('login');
  });

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('profile', { user: req.user });
  });


app.get('/todo', require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    if (req.query.id) {
      new Promise((resolve, reject) => {
        Todo.update({ _id: req.query.id },{ $set: { isdone: true } },
          (error, result) => {
            resolve(result);});
      }).then((value) => {
        new Promise((resolve, reject) => {
          Todo.find({ userid: req.user.id }, (error, result) => {
            resolve(result);
          }).sort({ isdone: 1, _id: -1 }).then((value) => {res.render('todo', {todo: value,user: req.user});});
        });
      });
    } else {
      new Promise((resolve, reject) => {
        Todo.find({ userid: req.user.id }, (error, result) => {
          resolve(result);
        }).sort({ isdone: 1, _id: -1 }).then((value) => {res.render('todo', {todo: value,user: req.user});});
      });
    }
  });

// обрабатываем запрос на добавление таска 
app.post('/todo', function (req, res) {
  require('connect-ensure-login').ensureLoggedIn();
  if (typeof req.body.taskName !== "undefined") {
    return new Promise((resolve, reject) => {
      Todo.create({ isdone: false, userid: req.user.id, name: req.body.taskName },
        (error, result) => {
          resolve(result);
        });
    }).then((value) => {
      new Promise((resolve, reject) => {
        Todo.find({ userid: req.user.id }, (error, result) => {
          resolve(result);
        }).sort({ isdone: 1, _id: -1 }).then((value) => {res.render('todo', { todo: value, user: req.user });});
      });
    })
  }
});

app.listen(3000);

