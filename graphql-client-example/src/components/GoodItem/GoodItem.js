import React, { Component } from 'react';
import styles from './GoodItem.module.css'

class GoodItem extends Component {
    constructor(props){
        super(props)
        let valutes = []
        for (let key in this.props.course){
            valutes=[...valutes,key]
        }
        this.state ={
            type: 'RUB',
            price:this.props.price,
            valutes: valutes
        }
    }

    selectStateChangedHandler(e){
        let new_state={
            type: e,
            price: e==='RUB'?this.props.price: (this.props.price/this.props.course[e])
        }
        this.setState(new_state)
    }

  render() {
    return (
        <div  className={styles.GoodItem}>
            <h2>{this.props.name}</h2>
        <p>
            Good's price: {Math.round(this.state.price*100)/100}
            <select onChange={ event => this.selectStateChangedHandler(event.target.value)}>
                <option key={0} value='RUB' >RUB</option>
                {this.state.valutes.map((elem,index)=>{
                    return <option key={index*10} value={elem}>{elem}</option>
                })}
            </select>
        </p>
            <div>
                {this.props.description}
            </div>
        </div>
    )
  }
}

export default GoodItem
