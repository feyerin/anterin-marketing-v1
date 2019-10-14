import React, { Component } from "react";
import {Table,Layout} from "antd";
import axios from "axios";
import {URL} from "../components/BaseUrl";
import DetailColumn from "../screens/Distributor/DetailColumn";

const { Content } = Layout;
const{Column} = Table;

export default class Distributor extends Component {
  //Login verivikator
  constructor(props){
    super(props);
    if(localStorage.getItem("token") == null){
      this.props.history.push('/')
    }
  }

    state = {
        data : []
      };

    componentDidMount(){
      axios.get(URL + "/api/v1/marketing/distributors?search=&sort=-balance",
      {
        headers : {
          Authorization : 'Bearer ' + localStorage.getItem("token")
        }
      })
      .then(response => {
        console.log(response);
        console.log('try');
        var newArray = [];
        response.data.data.forEach(item => {
          item.key = item.id;
          newArray.push(item);
        });
        this.setState({
          ...this.state,
          data: newArray
        });
      })
      .catch(function(error) {
        console.log(localStorage.getItem("token"));
        console.log(error);
      })
    }

    render(){

        return(
        <Content
            style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            marginTop: 16,
            minHeight: 280,
          }}
        >
        <Table dataSource={this.state.data} pagination={{defaultPageSize: 20}} >
          <Column title="name" dataIndex="name"  />
          <Column title="phone" dataIndex="phone"  />
          <Column title="email" dataIndex="email"  />
          <Column title="address" dataIndex="address"  />
          <Column title="detail" dataIndex="detail" 
        render={
          (unused1,obj,unused2) => <DetailColumn history={this.props.history} data={obj}/>
        }
        > 
        </Column>
        </Table>,
        </Content>
        );

        
    }
}