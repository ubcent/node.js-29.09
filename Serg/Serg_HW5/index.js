const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./DataBase');

const app = express();

db.setUpConnection();

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static('assets'));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index', {title: 'ToDo'});
});

app.get('/todos', (req, res) => {
  db.getToDos().then((data) => res.send(data));
});

app.post('/todos', (req, res) => {
  const {value} = req.body;
  db.createToDo(value).then((data) => res.send(data));
});

app.patch('/todos', (req, res) => {
  const {id, todoStatus} = req.body;

  db.toDoComplete(id, todoStatus).then((data) => res.send(data));
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
