const express = require('express');
const http = require('http');
const IO = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db');

const app = express();
const server = http.Server(app);
const io = IO(server);

const Task = require('./models/task');

io.on('connection', (socket) => {
  console.log('Someone has been connected');

  socket.on('task', (task) => {
    const tsk = new Task(task);
    tsk.save().then((task) => {
      socket.broadcast.emit('task', task);
      socket.emit('task', task);
    });
  });


  socket.on('taskdone', (req) => {
    Task.updateOne({ _id: req.taskid }, { $set: { isdone: true } }).then((task) => {
      Task.find().then((task) => {
        socket.broadcast.emit('taskdone', task);
        socket.emit('taskdone', task);
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('Someone has disconnected');
  });
});


app.get('/tasks', async (req, res) => {
  const task = await Task.find();
  res.json(task);
});

app.get('*', express.static(path.resolve(__dirname, '..', 'dist')));

server.listen(3000, () => {
  console.log('Server has been started');
})