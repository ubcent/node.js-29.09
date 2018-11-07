import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import ToDo from './screens/ToDo';
import './app.sass';

export default class App extends Component {
  render() {
    return (
        <div className="wrapper">
          <Switch>
            <Route exact path='/' component={ToDo}/>
          </Switch>
        </div>
    );
  }
}