const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
app.use(cookieParser());
app.use(session({keys: ['secret']}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('assets'));
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

passport.use(new LocalStrategy((username, password, done) => {
  if (!username) return done(null, false);
  if (!password) return done(null, false);

  return done(null, {
    firstName: 'Vasya',
    lastName: 'Pupkin',
    id: 1,
  });
}));

const authHandler = passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/fail',
});

app.get('/', (req, res) => {
  res.render('auth', {title: 'Авторизация'});
});

app.post('/auth', authHandler);

const mustbeAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/');
  }
};

app.all('/user', mustbeAuthenticated);
app.all('/user/*', mustbeAuthenticated);

app.get('/user', (req, res) => {
  res.send('User page');
});

app.get('/fail', (req, res) => {
  res.send('fail');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
