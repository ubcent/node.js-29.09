const Constants = {
  Actions: {
    NewTask: 'newTask',
    DeleteTask: 'deleteTask',
    TaskDone: 'taskDone',
    TaskUndone: 'taskUndone',
  },
  SocketMessageEventName: 'message',
  ServerAddress: 'http://localhost:3000',
  Routes: {
    TodoList: 'todo',  
  }
}

module.exports = Constants;