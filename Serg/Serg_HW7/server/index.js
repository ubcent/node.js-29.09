const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('express-jwt');
const guard = require('express-jwt-permissions')();
const helmet = require('helmet');
const http = require('http');
const path = require('path');
const cors = require('cors');
const db = require('./DataBase');

const KEY = 'secret';
const USER = 'admin';
const PASS = 'admin';
const PERMISSIONS = [
  'admin',
  'admin:read',
  'admin:write',
];

const app = express();
const server = http.Server(app);

db.setUpConnection();

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const verifyToken = jwtMiddleware({
  secret: KEY,
  getToken: function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] ===
        'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  },
});

app.all('/auth', (req, res) => {
  const {username, password} = req.body;

  if (username === USER && password === PASS) {
    const token = jwt.sign({USER, PERMISSIONS}, KEY);
    res.json({code: 0, token});
  } else {
    res.json({code: 1, message: 'Wrong credentials'});
  }
});

app.all('/api/*', verifyToken);

app.get('/api/todos', (req, res) => {
  db.getToDos().then((data) => res.send(data));
});

app.post('/api/todos', (req, res) => {
  const {login, name} = req.body;
  db.createToDo(login, name).then((data) => res.send(data));
});

app.patch('/api/todos', (req, res) => {
  const {id, status} = req.body;
  db.toDoComplete(id, status).then((data) => res.send(data));
});

app.delete('/api/todos/:id', (req, res) => {
  db.deleteToDo(req.params.id).then(data => res.send(data));
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({code: 1, message: 'Wrong credentials'});
  }
});

app.get('*', express.static(path.resolve(__dirname, '..', 'dist')));

server.listen(3000, () => {
  console.log('Server has been started');
});