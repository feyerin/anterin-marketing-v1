import React, { Component } from 'react';
import { Table,Layout,Tabs,Breadcrumb,Icon,Descriptions,notification,Button,Divider, DatePicker } from 'antd';
import axios from 'axios';
import ReactExport from "react-data-export";
import { URL } from "../../components/BaseUrl";


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { Column } = Table;
const { Content } = Layout;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const openNotificationWithIcon = type => {
  notification[type]({
    message: 'attention',
    description:
      'always click generate button before exporting data to CSV or the data will be not complete',
  });
};

export default class AgenDetail extends Component {
    constructor(props) {
        super(props)
        let modifiedData = props.location.state
        if (modifiedData.balance.code === 401){
          this.container = "user not registered"
       }else{
           this.container = props.location.state.balance.data[1].amount
       }
       this.state = {
        data : [],
        dataFromOtherComponent : modifiedData,
        drivers:[],
        pagination1 : {
          current : 1
        },
        pagination2 : {
          current : 1
        },
        loading: false,
        showMe: false,
        dataToExport:[],
        dateFrom: "",
        dateTo: ""
      };
    }
      
      handleTableChange = (pagination1) => {
        const pager = { ...this.state.pagination1 };
        pager.current = pagination1.current;
        this.setState({
          ...this.state,
          pagination1: pager
        },() => this.fetch());    
      }

      handleTableDriversChange = (pagination2) => {
        const pager = { ...this.state.pagination2 };
        pager.current = pagination2.current;
        this.setState({
          ...this.state,
          pagination2: pager
        },() => this.onSwichDrivers());    
      }

      componentDidMount(){
        this.fetch();
        this.onSwichDrivers();        
      }

      fetch = () => {
        this.setState({ 
          ...this.state,
          loading: true,
          pagination1 : {
            current: 1 } 
        });
        const pagination1 = { ...this.state.pagination1 };
        axios.get(
          URL + "api/v1/marketing/dealers/" + this.props.location.state.id + '/agents?page=' + this.state.pagination1.current + "&sort=name",
          {
          headers : {
            Authorization: "Bearer "+ localStorage.getItem("token")
          }
        }).then(response => {
          console.log(response);
          pagination1.total = response.data.pagination.total;
          var newArray = [];
          response.data.data.forEach(item => {
            item.key = item.id;
            item.token = item.balance.data[1].amount
            newArray.push(item);
          });
          this.setState({
            ...this.state,
            data: newArray,
            loading: false,
            pagination1,
          });
        })
        .catch(function(error) {
          console.log(error);
        })
      }

    onSwichDrivers = () => {
      this.setState({ 
        ...this.state,
        loading: true,
        pagination2 : {
          current: 1 }
      });
        const axios = require('axios');
        const pagination2 = { ...this.state.pagination2 };
        axios.get(URL + "api/v1/marketing/dealers/" + this.props.location.state.id + "/drivers?from=" + this.state.dateFrom + "&to=" + this.state.dateTo + "&page="+ this.state.pagination2.current,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token")
          }
        }).then(response => {
            pagination2.total = response.data.pagination.total;        
            console.log(response)
            var newArray = [];
            response.data.data.forEach(item => {
                    item.key = item.id;
                    item.created_at =  item.created_at.date;
                    newArray.push(item);
            })
              this.setState({
                ...this.state,
                  drivers: newArray,
                  loading: false,
                  pagination2,
              });
            }).catch(function (error) {
                console.log(error);
            });
    }

    ExportDealer = () => {
      this.setState({ loading: true });
      var self = this
      var newArray = [];
      axios.get(
        URL + "api/v1/marketing/dealers/" + this.props.location.state.id + '/agents?limit=100'
        + this.state.pagination1.current,
        {
        headers : {
          Authorization: "Bearer "+ localStorage.getItem("token")
        }
      }).then(response => {
        console.log(response)
        let dataSet1 =[
          {
            name:this.state.dataFromOtherComponent.name,
            phone:this.state.dataFromOtherComponent.phone,
            address:this.state.dataFromOtherComponent.address,
            agents_total:this.state.dataFromOtherComponent.agents_total,
            drivers_total:this.state.dataFromOtherComponent.drivers_total,
            token:this.container
          }
        ]
        response.data.data.forEach(item => {
          item.key = item.id;
          item.token = item.balance.data[1].amount;
          newArray.push(item);
        },()=> console.log("dataset1:", this.dataSet1));
        self.setState({
          ...self.state,
          dataToExport: dataSet1,
          data: newArray,
          loading:false,
          showMe:true
        });
      })
      .catch(function(error) {
        console.log(error);
      })
    }

    onChange=(dates, dateStrings) => {
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      this.setState({
        ...this.state,
        dateFrom : dateStrings[0],
        dateTo : dateStrings[1]
      }, () =>  this.componentDidMount())
    }

    render() {
        return (
            <div>
            <Breadcrumb style={{padding:5}}>
            <Breadcrumb.Item>
              <Icon type="audit" />
              <span>Dealer</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span>Detail</span>
            </Breadcrumb.Item>
            </Breadcrumb>
            <Content
                style={{
                    background: '#fff',
                    padding: 24,
                    margin: 0,
                    minHeight: 240,
                }}
            >
                <Descriptions title="Dealers Info" size="small" column={2}>
                  <Descriptions.Item label="name">{this.props.location.state.name}                    </Descriptions.Item>
                  <Descriptions.Item label="token"> {this.container}                                  </Descriptions.Item>
                  <Descriptions.Item label="agents total">{this.props.location.state.agents_total}    </Descriptions.Item>
                  <Descriptions.Item label="phone">{this.props.location.state.phone}                  </Descriptions.Item>
                  <Descriptions.Item label="drivers total">{this.props.location.state.drivers_total}  </Descriptions.Item>
                  <Descriptions.Item label="address">{this.props.location.state.address}              </Descriptions.Item>
                </Descriptions>


              </Content>

              <Content
                style={{
                  background: '#fff',
                  padding: 24,
                  marginTop: 50,
                  minHeight: 280,
                }}>
                
                <RangePicker style={{paddingTop:10, paddingBottom:10}} onChange={this.onChange} />                
                
                <div style={{float:"right",marginTop:10, marginBottom:10}}>  
                  <Button type="primary" 
                    onClick={this.ExportDealer}
                    loading={this.state.loading}> 
                    generate data
                  </Button>
                  <Divider type="vertical"/>
                  {
                    this.state.showMe? 
                    <ExcelFile 
                    
                    filename="dealers" 
                    element={<Button onClick={() => openNotificationWithIcon('warning')}>export to Excel</Button>}>
                  <ExcelSheet data={this.state.dataToExport} name="distributors" >
                      <ExcelColumn label="Name" value="name"/>
                      <ExcelColumn label="phone" value="phone"/>
                      <ExcelColumn label="address" value="address"/>
                      <ExcelColumn label="agents total" value="agents_total"/>
                      <ExcelColumn label="drivers total" value="drivers_total"/>
                      <ExcelColumn label="token" value="token"/>
                  </ExcelSheet>
                  <ExcelSheet data={this.state.data} name="dealers" >
                      <ExcelColumn label="Name" value="name"/>
                      <ExcelColumn label="phone" value="phone"/>
                      <ExcelColumn label="address" value="address"/>
                      <ExcelColumn label="drivers total" value="drivers_total"/>
                      <ExcelColumn label="token" value="token"/>
                  </ExcelSheet>
                  </ExcelFile>
                  :null
                }
              </div>

                <Tabs defaultActiveKey="1"  onChange={this.handleTableDriversChange} >
                    <TabPane tab="Agents" key="1">
                        <Table 
                            dataSource={this.state.data}
                            pagination={this.state.pagination1} 
                            loading={this.state.loading}
                            onChange={this.handleTableChange}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="address" dataIndex="address"  />
                            <Column title="drivers total" dataIndex="drivers_total"  />
                            <Column title="created at" dataIndex="created_at"/>
                            <Column title="token" dataIndex="token"/>
                        </Table>
                    </TabPane>
                    <TabPane tab="Drivers" key="2">
                    <Table 
                            dataSource={this.state.drivers}
                            pagination={this.state.pagination2} 
                            loading={this.state.loading}
                            onChange={this.handleTableDriversChange}>
                            <Column title="name" dataIndex="name"  />
                            <Column title="phone" dataIndex="phone"  />
                            <Column title="email" dataIndex="email"  />
                            <Column title="gender" dataIndex="gender"  />
                            <Column title="address" dataIndex="address"  />
                            <Column title="created at" dataIndex="created_at"/>
                        </Table>
                    </TabPane>
                </Tabs>
            </Content>
            </div>
        )
    }
}

