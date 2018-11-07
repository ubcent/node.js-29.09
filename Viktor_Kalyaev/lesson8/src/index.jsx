import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      username: '',
      taskText: '',
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/tasks')
      .then((response) => response.json())
      .then((tasks) => {
        this.setState({tasks});
        this.socket = io('http://localhost:3000');
        this.socket.on('task', (task) => {
          this.setState((prevState) => ({
            ...prevState,
            tasks: prevState.tasks.concat([task]),
          }))
        });

        this.socket.on('taskdone', (task) => {
          console.log(task);
          this.setState((prevState) => ({
            ...prevState,
            tasks: task,
          }))
        });
      });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSend = (event) => {
    const { username, taskText } = this.state;
    this.socket.emit('task', {username, taskText});
    this.setState({ taskText: '' });
    event.preventDefault();
  }

  handleSort= (taskid) => {
    console.log(taskid);
    this.socket.emit('taskdone', {taskid});
    event.preventDefault();
  }

  render() {
    const { tasks, taskText, username } = this.state;

    return (
      <div className="task">
        <ul>
          {tasks.map((task) => <li>
              <input type="checkbox"  onClick={()=>this.handleSort(task._id)}  />
              {task.isdone?'done ':'In progress '} Creator:{task.username}  Task:{task.taskText}
              </li>
              )}
        </ul>
        <form>
          <input onChange={this.handleChange} value={username} type="text" placeholder="username" name="username" /><br/>
          <textarea onChange={this.handleChange} value={taskText} name="taskText" placeholder="Task text" /><br/>
          <button onClick={this.handleSend}>Add task</button>
        </form>
      </div>
    )
  } 
}

ReactDOM.render(<App />, document.getElementById('root'));