const mongoose = require('mongoose');
const config = require('./config');
const modules = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const consolidate = require('consolidate');
const path = require('path');
const app = express();

const auth = passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/auth',
});

const checkForAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/auth');
    }
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new LocalStrategy((username, password, done) => {
    if (username !== 'admin' || !username) {
        return done(null, false);
    }

    if (password !== '12345' || !password) {
        return done(null, false);
    }

    return done(null, {
        user: username,
        password: password,
    });
}));

app.use(cookieParser());
app.use(cookieSession({
    keys: ['token']
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine('pug', consolidate.pug);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

mongoose.set('useFindAndModify', false);

mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true
}, err => {
    if (err) {
        console.log('[Mongoose] Ошибка подключения:', err);
    } else {
        console.log('[Mongoose] Подключено');
    }
    console.log();
});

app.get('/', auth);

app.get('/app', (req, res) => {
    modules.Task.find({}, (err, obj) => {
        if (err) {
            console.log('[Mongoose] Ошибка при поиске объекта:', err);
        } else {
            if (obj) {
                obj.sort((a, b) => {
                    a = new Date(a.created);
                    b = new Date(b.created);
                    return a > b ? -1 : a < b ? 1 : 0;
                });
            }
            res.render('index', {
                todolist: obj
            });
        }
    });
});

app.post('/create', (req, res) => {
    const now = new Date();
    modules.Task.create({
        name: req.body.name,
        created: now
    }, (err, obj) => {
        if (err) {
            console.log('[Mongoose] Невозможно сохранить объект:', err);
        } else {
            console.log(`[Mongoose] Объект: ${obj} сохранён`);
        }
        res.redirect('/app');
    });
    console.log();
});

app.post('/update', (req, res) => {
    modules.Task.findOneAndUpdate({
        _id: req.body._id
    }, {
        $set: {
            name: req.body.name
        }
    }, (err, obj) => {
        if (err) {
            console.log(`[Mongoose] Ошибка при обновлении объекта: ${obj}, ${err}`);
        } else {
            console.log(`[Mongoose] Объект: ${obj} обновлён, изменен name на ${req.body.name}`);
        }
        res.redirect('/app');
    });
    console.log();
});

app.post('/delete', (req, res) => {
    modules.Task.findOneAndDelete({
        _id: req.body._id
    }, (err, obj) => {
        if (err) {
            console.log(`[Mongoose] Ошибка при удалении объекта: ${obj}, ${err}`);
        } else {
            console.log(`[Mongoose] Объект: ${obj} удален`);
        }
        res.redirect('/app');
    });
    console.log();
});

app.post('/login', auth);

app.get('/auth', (req, res) => {
    res.render('auth');
});

app.all('/app', checkForAuth);
app.all('/app/*', checkForAuth);

app.listen(config.expressPort, () => {
    console.log(`[Express] Сервер запущен на порту ${config.expressPort}!`);
});