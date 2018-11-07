const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const upload = multer();
const consolidate = require('consolidate');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const app = express();

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'auth'));

app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
}));
app.use(cookieParser());
app.use(session({ keys: ['secret'] }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.resolve(__dirname, 'auth/files')));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// authentication local

passport.use(new LocalStrategy((username, password, done) => {
  if(username !== 'rank') {
    return done(null, false);
  }

  if(password !== '171') {
    return done(null, false);
  }

  return done(null, { username: 'Rank Up', id: 1 });
}));

// authentication google

passport.use(new GoogleStrategy({
    clientID: '1035551360286-iafo4n4didainjsj8i2u2jv4r17ou1op.apps.googleusercontent.com',
    clientSecret: 'dfWILiW20gm9iS3tr4xxJ0Xo',
    callbackURL: '/auth/google/callback',
  },
  function (accessToken, refreshToken, profile, done) {
    if (profile) {
      user = profile;
      return done(null, user);
    } else {
      return done(null, false);
    }
  },
))

const authHandler = passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/auth',
});

// Render auth-form. If there is cookie, pass values to inputs.

app.get('/auth', (req, res) => {
  if (req.session.username && req.session.password) {
    res.render('login', {
      login: req.session.username,
      pass: req.session.password,
    });
  } else {
    res.render('login');
  }
});

// Create or rewrite cookie if remember-pass is checked.
// Check, if entered logina nd password are alright.

app.post('/auth', upload.any(), (req, res, next) => {
  if (req.body.remember) {
    req.session.username = req.body.username;
    req.session.password = req.body.password;
  }
  next();
}, authHandler);

// Redirect, if there is no passport session

const mustbeAuthenticated = (req, res, next) => {
  if(req.user) {
    next();
  } else {
    res.redirect('/auth');
  }
}

// Redirect from root to user.

app.all('/', (req, res) => {
  res.redirect('/user');
})

// Check, if current user is authenticated.

app.all('/user', mustbeAuthenticated);
app.all('/user/*', mustbeAuthenticated);

// Render success.html, if use is authenticated.

app.get('/user', (req, res) => {
  res.render('../user/success');
});

// google auth handlers

app.get('/auth/google', passport.authenticate(
  'google', 
  {scope:['https://www.googleapis.com/auth/plus.login']}, 
));

app.get('/auth/google/callback', 
  passport.authenticate('google', {failureRedirect: '/auth'}),
  (req, res) => {
    res.redirect('/user');
  }
);

// Log out.

app.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
})

app.listen(3000);
