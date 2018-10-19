const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const consolidate = require('consolidate');

const app = express();

app.engine('hbs', consolidate.handlebars);

app.use(cookieParser());
app.use(session({ keys: ['secret'] })); 

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

// authentication
passport.use(new LocalStrategy((login, password, done) => {
  
  if (login !== 'admin') {
    return done(null, false);
  }
  
  if (password !== 'admin') {
    return done(null, false);
  }
  
  console.log('fuck');
  
  return done(null, { 
    firstName: 'Вася', 
    lastName: 'Пупкин', 
    login: username,
    id: 1 
  });
  
  
}));

const authHandler = passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/auth',
});

app.get('/auth', (req, res) => {
  console.log(req.body);
  res.render('login');
});

app.post('/auth', authHandler);

const mustBeAuthentificated = (req, res, next) => {
  if (req.user) {
	next();
  } else {
	res.redirect('/auth')
  }
}


app.all('/user', mustBeAuthentificated);
app.all('/user/*', mustBeAuthentificated);

app.get('/user', (req, res) => {
  res.send('User page');
})

app.listen(3000);


