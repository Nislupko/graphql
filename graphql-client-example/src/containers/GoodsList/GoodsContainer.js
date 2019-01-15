import React, { Component } from 'react';

class GoodsContainer extends Component {
  render() {
    return (
        <div className='GoodsContainer'>
            {this.props.children}
        </div>
    )
  }
}

export default GoodsContainer
