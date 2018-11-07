import './todolist.css';
import Constants from '../helpers/constants';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      newTaskName: '',
    }
  }

  componentDidMount() {
    fetch(`${Constants.ServerAddress}/${Constants.Routes.TodoList}`)
    .then(response => response.json())
    .then(responseData => {
      this.setState({
        tasks: responseData,
      });
      this.socket = io(Constants.ServerAddress);
      this.socket.on(Constants.SocketMessageEventName, tasks => {
        this.setState(prevState => ({...prevState, tasks}));
      });
    });
  }

  handleChange = (event) => {
    this.setState({newTaskName: event.target.value});
  }
 
  handleButtonClick = (event) => {
    let message = {};    
    if(event.target.id === 'button-add-task') {
      message = {
        action: Constants.Actions.NewTask, 
        name: this.state.newTaskName,
      };
      this.setState({newTaskName: ''});
    } else if(event.target.className === 'button-delete') {
      message = {
        action: Constants.Actions.DeleteTask, 
        id: event.target.parentElement.getAttribute('id'),
      };
    } else if(event.target.className === 'button-done') {
      message = {
        action: event.target.parentElement.getAttribute('done') === 'true' ? Constants.Actions.TaskUndone : Constants.Actions.TaskDone,
        id: event.target.parentElement.getAttribute('id'),
      }
    } 
    this.socket.emit(Constants.SocketMessageEventName, message);
  }

  renderTask = (task) => {
    const buttonDoneText = task.done ? 'Не сделано' : 'Сделано';
    
    return <div className="div-task" id={task._id} done={`${task.done}`}>
      <button className="button-done" onClick={this.handleButtonClick}>{buttonDoneText}</button>
      <button className="button-delete" onClick={this.handleButtonClick}>Удалить</button>
      <span className="span-task-name">{task.name}</span>
      <span className="span-task-created">Создано: {new Date(task.createdAt).toLocaleString()}</span>
      <span className="span-task-updated">Обновлено: {new Date(task.updatedAt).toLocaleString()}</span>
    </div>
  }

  render() {
    const {tasks, newTaskName} = this.state;

    return (
      <div className="container">
        <div id="header">
          <div id="new-task">
            <h3>Добавить новую задачу</h3>
            <input id="text-task-name" onChange={this.handleChange} value={newTaskName} type="text" placeholder="Введите название"/>
            <button id="button-add-task" onClick={this.handleButtonClick}>Добавить</button>
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