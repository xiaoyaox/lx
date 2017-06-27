//公文报送
import $ from 'jquery';
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import {Link} from 'react-router/es6';
import { WhiteSpace, WingBlank, Button,DatePicker, List,
  InputItem,TextareaItem,Modal,Drawer} from 'antd-mobile';
import { Table,Icon} from 'antd';
import DS_DetailComp from './ds_detail_comp.jsx';//公文详情

import moment from 'moment';
import 'moment/locale/zh-cn';
const zhNow = moment().locale('zh-cn').utcOffset(8);

//已废弃不用。
class DocumentSubmission extends React.Component {
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
      modules: '发文管理',
      type: '办理',
      urgency: '十万火急',
      sender:'奥利奥',
      sendTime:'2017/06/01 17:19'
    }, {
      key: '2',
      title:'党委会议记要2',
      modules: '发文管理2',
      type: '办理2',
      urgency: '十万火急2',
      sender:'奥利奥2',
      sendTime:'2017/05/01 18:19'
    }, {
      key: '4',
      title:'党委会议记要2',
      modules: '发文管理2',
      type: '办理2',
      urgency: '十万火急2',
      sender:'奥利奥2',
      sendTime:'2017/05/01 18:19'
    }];
    this.setState({
      tableData:data
    });
  }

  onTableRowClick = (record,index) => {
    console.log("record:",record);
    this.setState({
      docked: !this.state['docked'],
    });
  }
  backToTableListCall = () => {
    this.setState({
      docked: !this.state['docked'],
    });
  }

  render() {
    const tableColumns = [{
          title: '标题',
          dataIndex: 'title',
          key: 'title',
        }, {
          title: '模块',
          dataIndex: 'modules',
          key: 'modules',
        }, {
          title: '性质',
          dataIndex: 'type',
          key: 'type',
        }, {
          title: '紧急程度',
          dataIndex: 'urgency',
          key: 'urgency',
      }, {
        title: '送文人',
        dataIndex: 'sender',
        key: 'sender',
      }, {
        title: '发送时间',
        dataIndex: 'sendTime',
        key: 'sendTime',
      }
    ];
    let detailPage = (
      <DS_DetailComp backToTableListCall={this.backToTableListCall}/>
    );
    const drawerProps = {
      docked: this.state.docked,
      open: false,
      position: 'right',
    };
    return (
      <div>
        <Drawer
          className="documentSubmission_drawer"
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

DocumentSubmission.defaultProps = {
};

DocumentSubmission.propTypes = {
  title:React.PropTypes.string,
};

export default DocumentSubmission;
