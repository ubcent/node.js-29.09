const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const consolidate = require('consolidate');
const path = require('path');
const passport = require('passport');
const passportGithubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = '050f0e61264277b14a19';
const GITHUB_CLIENT_SECRET = 'd85bca2574d68b93fb5f5b02fa6313b16aae27b4';

const app = express();
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
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

const githubAuthUrl = '/auth/github';
const githubCallbackUrl = '/auth/github/callback';

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new passportGithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: githubCallbackUrl,
  }, 
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));

app.get(githubAuthUrl, passport.authenticate('github'));

app.get(githubCallbackUrl, passport.authenticate('github', { failureRedirect: '/error' }), async (req, res) => {
  // res.redirect('/todo');
  // res.send('success');
  // res.redirect('/todo');
  const tasks = await TodoList.getTasks();
  res.render('todolist', {
    tasks: JSON.stringify(tasks),
  });
});

app.get('/todo', require('connect-ensure-login').ensureLoggedIn(githubAuthUrl), async (req, res) => {
  // const tasks = await TodoList.getTasks();
  // res.render('todolist', {
  //   tasks: JSON.stringify(tasks),
  // });
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