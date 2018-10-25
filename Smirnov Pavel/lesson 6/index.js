const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const temph = require("consolidate");

const app = express();
app.use(cookieParser());
app.use(session({ keys: ['secret'] }));

app.use(passport.initialize());
app.use(passport.session());

// authentication
passport.use(new LocalStrategy((username, password, done) => {
    if(username !== 'admin') {
        return done(null, false);
    }

    if(password !== 'admin') {
        return done(null, false);
    }

    return done(null, { firstName: 'Vasya', lastName: 'Pupkin', id: 1 });
}));

const authHandler = passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/auth',
});

app.get('/auth', (req, res) => {
    res.render('auth');
});

app.post('/auth', authHandler);

const mustbeAuthenticated = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.redirect('/auth');
    }
};

app.all('/user', mustbeAuthenticated);
app.all('/user/*', mustbeAuthenticated);

app.get('/user', (req, res) => {
    res.send('User page');
});

app.listen(3333);