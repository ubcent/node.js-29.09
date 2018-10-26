import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './screens/Login';
import Home from './screens/Home';
import './app.sass';

export default class App extends Component {
  render() {
    return (
        <div className="wrapper">
          <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/home/:login' component={Home}/>
          </Switch>
        </div>
    );
  }
}