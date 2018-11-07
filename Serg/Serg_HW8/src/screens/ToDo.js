import React, {Component} from 'react';
import io from 'socket.io-client';
import api from '../utils/api';

export default class Todo extends Component {
  state =
      {
        todos: [],
        login: 'admin',
        name: '',
      };

  init = async () => {
    const {data: todos} = await api.get('/api/todos');
    this.setState({todos});
    this.socket = io('http://localhost:3000');
    this.socket.on('message', (message) => {
      this.setState((prevState) => ({
        ...prevState,
        todos: prevState.todos.concat([message]),
      }));
    });

    this.socket.on('changeStatus', (resp) => {
      const {_id: id, status} = resp;
      this.setState((prevState) => ({
        ...prevState,
        todos: prevState.todos.map((item) => {
          if (item._id === id) {
            item.status = status;
            return item;
          } else {
            return item;
          }
        }),
      }));
    });
  };

  componentDidMount() {
    this.init();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {login, name} = this.state;
    this.socket.emit('message', {login, name});
    this.setState({name: ''});
  };

  changeStatus = (e) => {
    const id = e.target.id;
    const status = !e.target.className;
    this.socket.emit('changeStatus', {id, status});
  };

  render() {
    const {name, todos} = this.state;
    return (
        <div>
          <ul>{todos.map((todo) =>
              <li key={todo._id} className="item_name">
                <span id={todo._id}
                      className={todo.status
                          ? 'item_done'
                          : null}
                      onClick={this.changeStatus}>{todo.name}
                      </span>
              </li>)}
          </ul>
          <form className="panel addForm" onSubmit={this.handleSubmit}>
            <header className="addForm_header"><h3>Добавить задачу</h3></header>
            <textarea rows="8" cols="32" name="name"
                      onChange={this.handleChange}
                      placeholder="Введите текст задачи"
                      value={name}></textarea><br/>
            <input className="button" type="submit" value="Отправить"/>
          </form>
        </div>
    );
  }
}