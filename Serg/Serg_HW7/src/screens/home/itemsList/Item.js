import React, {Component} from 'react';
import api from '../../../utils/api';

export default class Item extends Component {
  state = {
    delete: false,
    status: this.props.item.status,
  };

  delItem = () => api.delete(`/api/todos/${this.props.item._id}`)
      .then(() => this.props.reload());

  changeStatus = () => api.patch('/api/todos',
      {id: this.props.item._id, status: !this.state.status})
      .then(() => this.setState((prevState) => ({status: !prevState.status})));

  componentWillMount() {
    this.setState({delete: true});
  }

  render() {
    const {item: {name, createdAt}} = this.props;
    const date = new Date(createdAt);

    const del = this.state.delete
        ? <span className="item_delete"
                onClick={this.delItem}>Удалить</span>
        : null;

    return (
        <article className="item panel">
          <header><h3>Задача</h3></header>
          <p className="item_name"><span className={this.state.status && 'item_done'}
                   onClick={this.changeStatus}>{name}</span></p>
          <footer className="item_footer">{date.toLocaleString()} {del}</footer>
        </article>
    );
  }
}