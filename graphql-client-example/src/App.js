import React, { Component } from 'react';
import styles from './App.module.css';
import GoodItem from './components/GoodItem/GoodItem'
import GoodsContainer from "./containers/GoodsList/GoodsContainer";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

const client = new ApolloClient({
    uri: "http://localhost:4000"
});

class App extends Component {

    constructor(props){
        super(props)
        this.state ={
            course: {},
            goods: []
        }
    }

    componentWillMount() {
        client
            .query({
                query: gql`
                  {
                    courses{
                        CharCode
                        Value
                    },
                    goods{
                        name,
                        description,
                        price
                    }
                  }
                `
            })
            .then(result => {
                let newState= {
                    course:{},
                    goods:[]
                }
                result.data.courses.map(elem=>{
                    return newState.course[elem.CharCode]=elem.Value
                })
                result.data.goods.map(elem=>{
                    return newState.goods=[...newState.goods,elem]
                })
                this.setState(newState)
            });
    }

    render() {
        return (
            <GoodsContainer className={styles.App}>
                {this.state.goods.map((elem,index)=>{
                    return(
                        <GoodItem
                            key={index}
                            price={elem.price}
                            name={elem.name}
                            description={elem.description}
                            course={this.state.course}
                        />
                )
                })}
                {
                    (this.state.goods.length < 0) ? (
                        <>
                            <GoodItem
                                key={100000}
                                price={3500}
                                name="Test"
                                description="You have no data in database? this item is for you"
                                course={this.state.course}
                            />
                            <GoodItem
                                key={100001}
                                price={2500}
                                name="Test too"
                                description="(this one is for you too)"
                                course={this.state.course}
                            />
                        </>
                    ) : <></>
                }

            </GoodsContainer>
        );
    }
}

export default App;
