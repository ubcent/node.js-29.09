const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('express-jwt');
const guard = require('express-jwt-permissions')();
const cors = require('cors');

const KEY = 'secret';
const user = 'admin';
const pass = 'admin';
const permissions = [
  'admin',
  'admin:read',
  'admin:write',
];

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('assets'));

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));

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

app.all('/user', verifyToken);
app.all('/user', guard.check('admin'));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

app.all('/', (req, res) => {
  res.render('auth', {title: 'Авторизация'});
});

app.get('/auth', (req, res) => {
  res.render('auth', {title: 'Авторизация'});
});

app.post('/auth', (req, res) => {
  const {username, password} = req.body;

  if (username === user && password === pass) {
    const token = jwt.sign({user, permissions}, KEY);
    res.cookie('token', token);
    res.status(200).send({
      text: 'Auth done!',
    });
  } else {
    res.json({code: 1, message: 'Wrong credentials'});
  }
});

app.get('/user', (req, res) => {
  res.send('User page');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
