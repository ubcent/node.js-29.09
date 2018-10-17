const express = require('express')
var templating = require('consolidate');
bodyParser = require('body-parser');
require('./todo.js')();
const app = express()
const port = 3003

// выбираем функцию шаблонизации для hbs
app.engine('hbs', templating.handlebars);
// по умолчанию используем .hbs шаблоны
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }))
// указываем директорию для загрузки шаблонов
app.set('views', __dirname + '/views');
// обрабатываем запросы к главной странице
app.get('/', function (req, res) {

    if (typeof req.query.id !== "undefined") {
        updateTodoWithPromise(req.query.id).then((value) => {
        }).then((value) => {
            getTodoWithPromise().then((value) => {
                res.render('todo', {
                    todo: value
                });
            });
        });
    } else {
        getTodoWithPromise().then((value) => {
            res.render('todo', {
                todo: value
            });
        });
    }
});

// обрабатываем запрос на добавление таска 
app.post('/', function (req, res) {
    if (typeof req.body.taskName !== "undefined" ) {
        setTodoWithPromise(req.body.taskName).then((value) => {
            return getTodoWithPromise();
        }).then((value) => {
            res.render('todo', {
                todo: value
            });
        });
    } else {
        console.log('error');
    }
});

app.listen(port, () => console.log(`app listening on port ${port}!`))


function getTodoWithPromise() {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/db');
    const Todo = mongoose.model('Todo');
    return new Promise((resolve, reject) => {
        Todo.find({}, (error, result) => {
            resolve(result);
            mongoose.disconnect();
        }).sort({ isdone: 1, _id: -1 });
    })
}

function setTodoWithPromise(taskname) {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/db');
    const Todo = mongoose.model('Todo');
    return new Promise((resolve, reject) => {
        Todo.create({ isdone: false, name: taskname },
            (error, result) => {
                resolve(result);
                mongoose.disconnect();
            });
    })
}

function updateTodoWithPromise(id) {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/db');
    const Todo = mongoose.model('Todo');
    return new Promise((resolve, reject) => {
        Todo.update({ _id: id },
            { $set: { isdone: true } },
            (error, result) => {
                resolve(result);
                mongoose.disconnect();
            });
    })
}