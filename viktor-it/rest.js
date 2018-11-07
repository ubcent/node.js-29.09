const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const KEY = 'secret';

mongoose.connect('mongodb://127.0.0.1:27017/users', { useNewUrlParser: true });
mongoose.connection.on('open', function(){
  console.log('Приконектился к Mongo!');
});

const User = require('./models/usersNew');

const app = express();
app.use(bodyParser.json());

function verifyToken(req, res, next) {
  const authorization = req.headers['authorization'];
  if(!authorization) {
    res.json({ code: 2, message: 'Unauthenticated' });
  }
  const [, token] = authorization.split(' ');
  jwt.verify(token, KEY, (err, decoded) => {
    if(err) {
      res.json({ code: 2, message: 'Unauthenticated' });
    }

    req.user = decoded;
    next();
  });
};

app.post('/auth', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({username, password}).lean().exec();
  if(user) {
    //const { _id: id, username, lastname } = user;
    res.json({
      access_token: jwt.sign(user, KEY),
    })
  } else {
    res.json({ code: 1, message: 'Wrong credentials' });
  }
});

app.all('/users', verifyToken);
app.all('/users/*', verifyToken);

app.get('/users', async (req, res) => {
  const users = await User.find();

  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  res.json(user);
});

app.post('/usersCreate', async (req, res) => {
  let user = new User(req.body);
  user = await user.save();
  if(user){
  	res.json(`Добавлен ${user}`)
  } else {
  	res.json({code: 3, message: 'Wrong syntax or error json'});
  }
});

app.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body);
  res.json(user);
});

app.patch('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });

  res.json(user);
});

app.delete('/users/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  res.json(user);
});

app.listen(3000);
