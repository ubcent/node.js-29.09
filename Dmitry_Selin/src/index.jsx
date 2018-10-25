import './todolist.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

const ServerAddress = 'http://localhost:3000';

// state: tasks
// send: action, task_info (name for new or id otherwise)
// receive: tasks

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      newTaskName: '',
    }
  }

  componentDidMount() {
    fetch(`${ServerAddress}/todo`)
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        tasks: responseData,
      });
      this.socket = io(ServerAddress);
      this.socket.on('message', tasks => {
        this.setState(prevState => ({...prevState, tasks}));
      });
    });
  }

  handleChange = (event) => {
    console.log(event.target.value);
    this.setState({newTaskName: event.target.value});
  }

  handleAddTask = (event) => {
    this.socket.emit('message', {action: 'newTask', name: this.state.newTaskName});
    this.setState({newTaskName: ''});
  }

  renderTask = (task) => {
    return <div className="div-task" id={task._id}>
      <button className="button-done">Сделано</button>
      <button className="button-delete">Удалить</button>
      <span className="span-task-name">{task.name}</span>
      <span className="span-task-created">Создано: {new Date(task.createdAt).toLocaleString()}</span>
      <span className="span-task-updated">Обновлено: {new Date(task.updatedAt).toLocaleString()}</span>
    </div>
  }

  render() {
    const {tasks, newTaskName} = this.state;
    console.log(tasks);

    return (
      <div className="container">
        <div id="header">
          <div id="new-task">
            <h3>Добавить новую задачу</h3>
            <input id="text-task-name" onChange={this.handleChange} value={newTaskName} type="text" placeholder="Введите название"/>
            <button id="button-add-task" onClick={this.handleAddTask}>Добавить</button>
          </div>
        </div>
        <h4>Актуальные задачи</h4>
        <div id="div-tasks-undone">
          {tasks.map(task => task.done ? null : this.renderTask(task))}
        </div>
        <h4>Завершенные задачи</h4>
        <div id="div-tasks-done">
          {tasks.map(task => task.done ? this.renderTask(task) : null)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));