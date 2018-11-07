const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const Task = require('./models/task');
mongoose.connect('mongodb://localhost/db', { useNewUrlParser: true });

const KEY = 'secret';
const app = express();
app.use(bodyParser.json());

app.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }).lean().exec();
    if (user) {
        const { _id: id, username, fullName } = user;
        res.json({
            access_token: jwt.sign({ id, username, fullName }, KEY),
        })
    } else {
        res.json({ code: 1, message: 'Wrong credentials' });
    }
});

function verifyToken(req, res, next) {
    const authorization = req.headers['authorization'];
    if (!authorization) {
        res.json({ code: 2, message: 'Unauthenticated' });
    }
    const [, token] = authorization.split(' ');
    jwt.verify(token, KEY, (err, decoded) => {
        if (err) {
            res.json({ code: 2, message: 'Unauthenticated' });
        }
        req.user = decoded;
        next();
    });
}

app.post('/task', verifyToken, async (req, res) => {
    let task = new Task(req.body);
    task = await task.save();
    res.json(task);
});

app.get('/task', verifyToken, async (req, res) => {
    const task = await Task.find();

    res.json(task);
});

app.delete('/task/:id', verifyToken, async (req, res) => {
    const task = await Task.findByIdAndRemove(req.params.id);
    res.json(task);
});

app.put('/task/:id', verifyToken, async (req, res) => {
    const task =await  Task.findByIdAndUpdate(req.params.id, req.body);
    res.json(task);
});

app.patch('/task/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.json(task);
});

app.listen(8888);