import React, {Component, Fragment} from 'react';
import {NavLink} from 'react-router-dom';
import api from '../utils/api';
import ItemList from './home/ItemsList';
import AddForm from './home/AddForm';

export default class Home extends Component {
  state = {
    items: 'Загружается....',
  };

  getItems = async () => {
    const items = await api.get('/api/todos');
    this.setState(
        {items: <ItemList items={items.data} reload={this.getItems}/>});
  };

  componentDidMount() {
    this.getItems();
  }

  render() {
    const {login} = this.props.match.params;

    return (
        <Fragment>
          <nav>
            <NavLink to='/' exact>К авторизации</NavLink>
          </nav>
          <main className="home">
            {this.state.items}
            <AddForm login={login} reload={this.getItems}/>
          </main>
        </Fragment>
    );
  }
}
