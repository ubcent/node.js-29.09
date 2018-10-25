const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const IO = require('socket.io');
const mongoose = require('mongoose');
const consolidate = require('consolidate');

const TodoList = require('./helpers/todolist')
const User = require('./models/user');
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useCreateIndex: true });

const app = express();
const server = http.Server(app);
const io = IO(server);

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('message', async (message) => {
    // receive: {action, taskInfo (name for new and id for old)}
    // send: {task}
    // message = {action, task_id}
    // perform action on task by id with database
    // broadcast message

    if(message.action === 'newTask'){
      await TodoList.addTask(message.name);
    } else if(message.action === 'deleteTask'){
      await TodoList.deleteTask(message.id);
    } else if(message.action === 'taskDone'){
      await TodoList.markTaskDone(message.id);
    } else if(message.action === 'taskUndone'){
      await TodoList.markTaskUndone(message.id);
    }
    const tasks = await TodoList.getTasks();

    socket.broadcast.emit('message', tasks);
    socket.emit('message', tasks);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/todo', async (req, res) => {
  const tasks = await TodoList.getTasks();
  res.json(tasks);
});

// app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('*', express.static(path.resolve(__dirname, 'dist')));

server.listen(3000, () => {
  console.log('Server started');
});