const mongoose = require('mongoose');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const Task = require('./models').Task;

app.use(bodyParser.urlencoded({
    extended: false
}));

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

/* Create */
app.post('/tasks', async (req, res) => {
    let task = new Task(req.body);
    task = await task.save();
    await res.json(obj).status(200);
});

/* Read all (reversed sort) */
app.get('/tasks', async (req, res) => {
    Task.find({}, async (err, obj) => {
        !err ? await res.json(obj).status(200) : await res.status(400);
    });
});

/* Read by id */
app.get('/tasks/:id', async (req, res) => {
    Task.findById(req.params.id, async (err, obj) => {
        !err ? await res.json(obj).status(200) : await res.status(400);
    });
});

/* Update */
app.patch('/tasks/:id', async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, async (err, obj) => {
        !err ? await res.json(obj).status(200) : await res.status(400);
    });
});

/* Update (Modify) */
app.put('/tasks/:id', async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, req.body, async (err, obj) => {
        !err ? await res.json(obj).status(200) : await res.status(400);
    });
});

/* Delete */
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndRemove(req.params.id, async (req, obj) => {
        !err ? await res.json(obj).status(200) : await res.status(400);
    });
});

app.listen(config.expressPort, () => {
    console.log(`[Express] Сервер запущен на порту ${config.expressPort}!`);
});