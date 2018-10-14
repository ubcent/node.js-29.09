const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');

const app = express();
app.use(express.static('./public'));
app.use(bodyParser.json());
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

const Task = require('./models/task');
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true });

class TodoList{
  static async addTask(name){
    await (new Task({name})).save();
  }

  static async deleteTask(id){
    await Task.deleteOne({_id : id});
  }
  
  static async markTaskDone(id){
    await Task.updateOne(
      {_id: id}, 
      {$set: {done: true, updatedAt: new Date()}}
    );
  }

  static async markTaskUndone(id){
    await Task.updateOne(
      {_id: id}, 
      {$set: {done: false, updatedAt: new Date()}}
    );
  }

  static async getTasks(){
    const tasks = await Task.find();
    return tasks;
  }
}

app.get('/todo', async (req, res) => {
  const tasks = await TodoList.getTasks();
  res.render('todolist', {
    tasks: JSON.stringify(tasks),
  });
});

app.post('/todo', async (req, res) => {
  if(req.body.action === 'newTask'){
    await TodoList.addTask(req.body.name);
  } 
  else if(req.body.action === 'deleteTask'){
    await TodoList.deleteTask(req.body.id);
  }
  else if(req.body.action === 'taskDone'){
    await TodoList.markTaskDone(req.body.id);
  }
  else if(req.body.action === 'taskUndone'){
    await TodoList.markTaskUndone(req.body.id);
  }

  const tasks = await TodoList.getTasks();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(tasks));
});

app.listen(3000);