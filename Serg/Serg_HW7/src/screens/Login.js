import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import api from '../utils/api';

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    buttonDisabled: false,
    loginStatus: false,
  };

  handleChange = (e) => this.setState({[e.target.name]: e.target.value});

  handleSubmit = async (e) => {
    const {username, password} = this.state;

    this.setState({buttonDisabled: true});
    e.preventDefault();

    await api.post('/auth', {
      username,
      password,
    })
        .then((response) => {
          const {code, token} = response.data;

          if (+code === 0) {
            localStorage.setItem('token', token);
            this.setState({loginStatus: true});
          } else {
            alert('Неверный логин или пароль');
          }
        })
        .catch((error) => {
          alert('Проверьте сетевое подключение');
        });
    this.setState({buttonDisabled: false});
  };

  render() {
    const {username, password, loginStatus, buttonDisabled} = this.state;

    if (loginStatus) {
      sessionStorage.setItem('userLogin', username);
      return <Redirect to={`/home/${username}`}/>;
    }

    return (
        <div className="panel login">
          <header className="login_header"><h3>Авторизация</h3></header>
          <div className="login_content">
            <form className="login_content-form" onSubmit={this.handleSubmit}>
              <label>Логин: <input type="text"
                                   name="username"
                                   value={username}
                                   onChange={this.handleChange}/>
              </label>
              <label>Пароль: <input type="password"
                                    name="password"
                                    value={password}
                                    onChange={this.handleChange}/>
              </label>
              <input className="button"
                     type="submit"
                     disabled={buttonDisabled}
                     value="Войти"/>
            </form>
          </div>
          <footer className="login_footer">&copy; 2018</footer>
        </div>
    );
  }
}