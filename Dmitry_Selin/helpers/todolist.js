const Task = require('../models/task');

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

  module.exports = TodoList;