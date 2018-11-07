import React, {Component, Fragment} from 'react';
import api from '../../utils/api';

export default class AddForm extends Component {
  state = {
    login: this.props.login,
    name: '',
  };

  handleChange = (e) => this.setState({name: e.target.value});

  handleSubmit = (e) => {
    e.preventDefault();

    const {login, name} = this.state;

    if (name.trim()) {
      api.post('/api/todos', {login, name})
          .then(() => {this.setState({name: ''}); this.props.reload()});
    }
  };

  render() {
    const {login, name} = this.state;

    return (
        <Fragment>
          <form className="panel addForm" onSubmit={this.handleSubmit}>
            <header className="addForm_header"><h3>{login}</h3></header>
            <textarea rows="8" cols="32" name="name"
                      onChange={this.handleChange}
                      placeholder="Введите текст задачи" value={name}></textarea><br/>
            <input className="button" type="submit" value="Отправить"/>
          </form>
        </Fragment>
    );
  }
}
