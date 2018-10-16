const mongoose = require('mongoose');
const Todo = require('./Models');

const prefix = '127.0.0.1:27017';
const db = 'todos';

mongoose.set('useFindAndModify', false);

exports.setUpConnection = () => {
  mongoose.connect(`mongodb://${prefix}/${db}`, {useNewUrlParser: true}).then(
      (res) => {
        console.log('Connected to Database Successfully.');
      }).catch((err) => {
    console.log(`Connection to database failed. ${err}`);
  });
};

exports.getToDos = () => {
  return Todo.find();
};

exports.createToDo = (name) => {
  const todo = new Todo({name});
  return todo.save();
};

exports.toDoComplete = (id, status) => {
  return Todo.findOneAndUpdate({_id: id}, {$set: {'status': status}},
      {new: true},
      (err, doc) => {
        if (err) {
          console.log('Something wrong when updating data!');
        }
      });
};
