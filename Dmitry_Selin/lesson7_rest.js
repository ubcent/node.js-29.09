const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const Task = require('./models/task');
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useCreateIndex: true });

const Key = 'secret_key';

const ErrorCodes = {
  AuthenticationError: 1,
  AuthorizationError: 2,
  GetDataError: 3,
  UpdateDataError: 4,
}

const ErrorMessages = {
  AuthenticationError: 'Wrong credentials',
  AuthorizationError: 'Not authenticated',
  GetDataError: 'Failed to get data',
  UpdateDataError: 'Failed to update data',
}

const app = express();
app.use(bodyParser.json());

app.post('/auth', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({name: username});
  if(!user) {
    return res.status(403).json({code: ErrorCodes.AuthenticationError, message: ErrorMessages.AuthenticationError});
  }
  const passwordCorrect = await user.checkPassword(password);
  if(!passwordCorrect) {
    return res.status(403).json({code: ErrorCodes.AuthenticationError, message: ErrorMessages.AuthenticationError});
  }
  res.json({
    accessToken: jwt.sign({id: user.id, name: user.name}, Key),
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if(!token) {
    return res.status(401).json({code: ErrorCodes.AuthorizationError, message: ErrorMessages.AuthorizationError});
  }
  jwt.verify(token, Key, (err, decoded) => {
    if(err) {
      return res.status(401).json({code: ErrorCodes.AuthorizationError, message: ErrorMessages.AuthorizationError});
    }
    next();
  });
};

app.get('/tasks', verifyToken, (req, res) => {
  Task.find()
  .then(tasks => res.json(tasks))
  .catch(err => res.json({code: ErrorCodes.GetDataError, message: ErrorMessages.GetDataError}));
});

app.get('/tasks/:id', verifyToken, (req, res) => {
  Task.findById(req.params.id)
  .then(task => res.json(task))
  .catch(err => res.json({code: ErrorCodes.GetDataError, message: ErrorMessages.GetDataError}));
});

app.post('/tasks', verifyToken, (req, res) => {
  let task = new Task(req.body);
  task.save()
  .then(newTask => res.status(201).json(newTask))
  .catch(err => res.json({code: ErrorCodes.UpdateDataError, message: ErrorMessages.UpdateDataError}));
});

app.put('/tasks/:id', verifyToken, async (req, res) => {
  let newTask = req.body;
  newTask.createdAt = Date.now();
  newTask.updatedAt = Date.now();
  Task.findByIdAndUpdate(req.params.id, newTask, {new: true})
  .then(task => res.json(task))
  .catch(err => res.json({code: ErrorCodes.UpdateDataError, message: ErrorMessages.UpdateDataError}));
});

app.patch('/tasks/:id', verifyToken, async (req, res) => {
  let newTask = req.body;
  newTask.updatedAt = Date.now();
  Task.findByIdAndUpdate(req.params.id, {$set: newTask}, {new: true})
  .then(task => res.json(task))
  .catch(err => res.json({code: ErrorCodes.UpdateDataError, message: ErrorMessages.UpdateDataError}));
});

app.delete('/tasks/:id', verifyToken, (req, res) => {
  Task.findByIdAndDelete(req.params.id)
  .then(task => res.json(task))
  .catch(err => res.json({code: ErrorCodes.UpdateDataError, message: ErrorMessages.UpdateDataError}));
});

app.listen(8888);