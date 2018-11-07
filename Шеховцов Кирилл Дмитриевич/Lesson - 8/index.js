const mongoose = require('mongoose');
const config = require('./config');
const modules = require('./models');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');
const app = express();
const io = require('socket.io')(3001);

mongoose.set('useFindAndModify', false);

mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true
}, err => {
    if (err) {
        console.log('[Mongoose] Ошибка подключения:', err);
    } else {
        console.log('[Mongoose] Подключено');
    }
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine('pug', consolidate.pug);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/api', async (req, res) => {
    await modules.Task.find({}, async (err, obj) => {
        if (err) {
            console.log('[Mongoose] Ошибка при поиске объекта:', err);
        } else {
            if (obj) {
                obj.sort((a, b) => {
                    a = new Date(a.created);
                    b = new Date(b.created);

                    if (a > b) {
                        return -1;
                    } else if (a < b) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
            await res.json(obj);
        }
    });
});

app.get('/', async (req, res) => {
    await modules.Task.find({}, async (err, obj) => {
        if (err) {
            console.log('[Mongoose] Ошибка при поиске объекта:', err);
        } else {
            if (obj) {
                obj.sort((a, b) => {
                    a = new Date(a.created);
                    b = new Date(b.created);

                    if (a > b) {
                        return -1;
                    } else if (a < b) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
            await res.render('index', {
                todolist: obj
            });
        }
    });
});

app.post('/create', async (req, res) => {
    const now = new Date();
    await modules.Task.create({
        name: req.body.name,
        created: now
    }, (err, obj) => {
        if (err) {
            console.log('[Mongoose] Невозможно сохранить объект:', err);
        } else {
            console.log(`[Mongoose] Объект: ${obj} сохранён`);
        }
        res.status(200);
    });
});

app.post('/update', async (req, res) => {
    await modules.Task.findOneAndUpdate({
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
        res.status(200);
    });
});

app.post('/delete', async (req, res) => {
    await modules.Task.findOneAndDelete({
        _id: req.body._id
    }, (err, obj) => {
        if (err) {
            console.log(`[Mongoose] Ошибка при удалении объекта: ${obj}, ${err}`);
        } else {
            console.log(`[Mongoose] Объект: ${obj} удален`);
        }
        res.status(200);
    });
});


app.listen(config.expressPort, () => {
    console.log(`[Express] Сервер запущен на порту ${config.expressPort}!`);
});

io.on('connection', (socket) => {
    console.log('Новое IO подключение');

    socket.on('broadcast', message => {
        io.sockets.emit('broadcast', { author: message });
        console.log(`${message.author} совершил изменения TODO Board`);
    });

    socket.on('disconnect', () => {
        console.log('IO подключение закрыто');
    });
})