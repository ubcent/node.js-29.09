import React, {Component} from 'react';
import Item from './itemsList/Item';

export default class ItemsList extends Component {
  renderItems = (items, reload) => items.map(
      item => (<Item item={item} key={item._id} reload={reload}/>));

  render() {
    const {items, reload} = this.props;

    return (
        <div className="itemsList">{this.renderItems(items, reload)}</div>
    );
  }
}