//工作督查
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import {Link} from 'react-router/es6';

import { WhiteSpace, WingBlank, Button,DatePicker, List,
  InputItem,TextareaItem,Modal,Drawer} from 'antd-mobile';
import { Table,Icon} from 'antd';

import moment from 'moment';
import 'moment/locale/zh-cn';
import WS_DetailComp from './ws_detail_comp.jsx';//工作督查详情

const zhNow = moment().locale('zh-cn').utcOffset(8);

class WorkSupervision extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        docked:false,
        tableData:[],
      };
  }
  componentWillMount(){
    const data = [{
      key: '1',
      title:'党委会议记要',
      number: '发文管理',
      type: '办理',
      unit:'奥利奥',
      sendTime:'2017/06/01 17:19'
    }, {
      key: '2',
      title:'党委会议记要2',
      number: '发文管理2',
      type: '办理2',
      unit:'奥利奥2',
      sendTime:'2017/05/01 18:19'
    }, {
      key: '4',
      title:'党委会议记要2',
      number: '发文管理2',
      type: '办理2',
      unit:'奥利奥2',
      sendTime:'2017/05/01 18:19'
    }, {
      key: '5',
      title:'党委会议记要2',
      number: '发文管理2',
      type: '办理2',
      unit:'奥利奥2',
      sendTime:'2017/05/01 18:19'
    }, {
      key: '6',
      title:'党委会议记要2',
      number: '发文管理2',
      type: '办理2',
      unit:'奥利奥2',
      sendTime:'2017/05/01 18:19'
    }];
    this.setState({
      tableData:data
    });
  }
  backToTableListCall = () => {
    this.setState({
      docked: !this.state['docked'],
    });
  }
  onTableRowClick = (record,index) => {
    console.log("record:",record);
    this.setState({
      docked: !this.state['docked'],
    });
  }

  render() {
    const tableColumns = [{
          title: '序号',
          dataIndex: 'number',
          key: 'number',
        }, {
          title: '收文日期',
          dataIndex: 'sendTime',
          key: 'sendTime',
        }, {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
        }, {
          title: '表文单位',
          dataIndex: 'unit',
          key: 'unit',
        }, {
          title: '督办类别',
          dataIndex: 'type',
          key: 'type',
        }
    ];
    let detailPage = (
      <WS_DetailComp backToTableListCall={this.backToTableListCall}/>
    );
    const drawerProps = {
      docked: this.state.docked,
      open: false,
      position: 'right',
    };
    return (
      <div>
        <Drawer
          className="workSupervision_drawer"
          style={{ minHeight: document.documentElement.clientHeight - 200 }}
          dragHandleStyle={{ display: 'none' }}
          contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 60 }}
          sidebarStyle={{ background: '#fff',paddingTop: 0,zIndex:'99999',display:'inline' }}
          sidebar={detailPage}
          {...drawerProps}
        >
          <WingBlank size="sm">
            <div style={{fontWeight:'bold'}}>{this.props.title}:</div>
            <WhiteSpace size="lg" />
            <Table columns={tableColumns}
              dataSource={this.state.tableData}
              onRowClick={this.onTableRowClick}
              scroll={{ x: 1000 }} />
          </WingBlank>
        </Drawer>
      </div>
    )
  }
}

WorkSupervision.defaultProps = {
};

WorkSupervision.propTypes = {
};

export default WorkSupervision;
