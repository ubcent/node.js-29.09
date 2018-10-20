const mongoose = require('mongoose');
const config = require('./config');
const modules = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const consolidate = require('consolidate');
const path = require('path');
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.engine('pug', consolidate.pug);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

mongoose.set('useFindAndModify', false);

mongoose.connect(config.mongoUrl, {useNewUrlParser: true}, err => {
    if (err) {
        console.log('[Mongoose] Ошибка подключения:', err);
    } else {
        console.log('[Mongoose] Подключено');
    }
    console.log();
});

app.get('/', (req, res) => {
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
            res.render('index', {todolist: obj});
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
        res.redirect('/');
    });
    console.log();
});

app.post('/update', (req, res) => {
    modules.Task.findOneAndUpdate({_id: req.body._id}, {$set: {name: req.body.name}}, (err, obj) => {
        if (err) {
            console.log(`[Mongoose] Ошибка при обновлении объекта: ${obj}, ${err}`);
        } else {
            console.log(`[Mongoose] Объект: ${obj} обновлён, изменен name на ${req.body.name}`);
        }
        res.redirect('/');
    });
    console.log();
});

app.post('/delete', (req, res) => {
    modules.Task.findOneAndDelete(req.body._id, (err, obj) => {
        if (err) {
            console.log(`[Mongoose] Ошибка при удалении объекта: ${obj}, ${err}`);
        } else {
            console.log(`[Mongoose] Объект: ${obj} удален`);
        }
        res.redirect('/');
    });
    console.log();
});

app.listen(config.expressPort, () => {
    console.log(`[Express] Сервер запущен на порту ${config.expressPort}!`);
});