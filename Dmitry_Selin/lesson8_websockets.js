const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const IO = require('socket.io');
const mongoose = require('mongoose');

const Constants = require('./helpers/constants');
const TodoList = require('./helpers/todolist');
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useCreateIndex: true });

const app = express();
const server = http.Server(app);
const io = IO(server);

app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on(Constants.SocketMessageEventName, async (message) => {
    if(message.action === Constants.Actions.NewTask){
      await TodoList.addTask(message.name);
    } else if(message.action === Constants.Actions.DeleteTask){
      await TodoList.deleteTask(message.id);
    } else if(message.action === Constants.Actions.TaskDone){
      await TodoList.markTaskDone(message.id);
    } else if(message.action === Constants.Actions.TaskUndone){
      await TodoList.markTaskUndone(message.id);
    }
    const tasks = await TodoList.getTasks();

    socket.broadcast.emit(Constants.SocketMessageEventName, tasks);
    socket.emit(Constants.SocketMessageEventName, tasks);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get(`/${Constants.Routes.TodoList}`, async (req, res) => {
  const tasks = await TodoList.getTasks();
  res.json(tasks);
});

app.get('*', express.static(path.resolve(__dirname, 'dist')));

server.listen(3000, () => {
  console.log('Server started');
});