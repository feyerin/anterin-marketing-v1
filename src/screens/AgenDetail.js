import React, { Component } from 'react';
import { Table,Layout } from 'antd';
import axios from 'axios';
import {URL} from '../components/BaseUrl';

const { Column } = Table;
const { Content } = Layout;

export default class AgenDetail extends Component {
    constructor(props) {
        super(props)
        console.log("TES PASSING DATA", props.location.state)
    }

    state = {
        data : [],
        drivers:[]
      };
      

    componentDidMount(){
        axios.get(URL + "api/v1/marketing/agents/" + this.props.location.state.id + '/drivers',
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            }).then(response => {
                console.log('NESTEDCALLAPI ', response.data.data);
                var newArray = [];
      response.data.data.forEach(item => {
        item.key = item.id;
        newArray.push(item);
      });
      this.setState({
        ...this.state,
        data: newArray
      });
                
            }).catch(function (error) {
                console.log(error);
            });
    }
    render() {
        return (
            <Content
                style={{
                    background: '#fff',
                    padding: 24,
                    margin: 0,
                    marginTop: 16,
                    minHeight: 280,
                }}
            >
                <p>{this.props.location.state.name}</p>
                <p>{this.props.location.state.phone}</p>
                <p>{this.props.location.state.address}</p>
                <p>{this.props.location.state.drivers_total}</p>
                <p>{this.props.location.state.token}</p>

                    <Table dataSource={this.state.data}>
                        <Column title="name" dataIndex="name"  />
                        <Column title="phone" dataIndex="phone"  />
                        <Column title="address" dataIndex="address"  />
                        <Column title="drivers total" dataIndex="drivers_total"  />
                    </Table>
            </Content>
        )
    }
}
