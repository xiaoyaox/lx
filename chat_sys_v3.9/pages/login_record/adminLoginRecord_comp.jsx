// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';
import ReactDOM from 'react-dom';
import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import client from 'client/web_client.jsx';
import moment from 'moment';
import myWebClient from 'client/my_web_client.jsx';

import React from 'react';
import {Link} from 'react-router/es6';
import {Icon,message,Table} from 'antd';

import LoginRecordTimeSelect from './recordTime_select.jsx';

class AdminLoginRecordComp extends React.Component {
    constructor(props) {
        super(props);
        // this.handleSendLink = this.handleSendLink.bind(this);
        this.state = {
          todayDate:new Date(),
          loginData:[],
          aMonthAgo:moment(new Date()).subtract(30,'days'),
          isMobile:Utils.isMobile(),
        };
    }

    componentWillMount(){
      this.getSearchLoginRecord();
    }

    componentDidMount(){

    }

    getSearchLoginRecord(time) {
      //时间要是时间戳格式的。
      let params = {
        startTime: time && time.startTime ? time.startTime : moment(this.state.todayDate).startOf('month').valueOf(),
        endTime: time && time.endTime ? time.endTime : moment(this.state.todayDate).endOf('month').valueOf()
      };
      // console.log("today:",this.state.todayDate);
      myWebClient.getUserLoginRecordData(params,
        (data,res)=>{
          let objArr = JSON.parse(res.text);
          // console.log("获取用户登录记录数据成功-- res text:",objArr);
          objArr.reverse();
          const loginData = objArr.map((rec, i) => {
            // console.log(rec, i);
            return {
              key: i,
              time: rec.createAt ? moment(rec.createAt).format('YYYY-MM-DD HH:mm:ss') : null,
              userName: rec.username,
              operation: '登录成功',
              name: rec.username || ''
            }
          })
          this.setState({ loginData });
        },
        (e,err,res)=>{
          message.error("获取用户登录记录数据失败！");
        }
      );
    }

    render() {
      let listItem =[];
      const adminLoginRecordColumns = [{
          title: '时间戳',
          dataIndex: 'time',
          key: 'time',
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
        }, {
          title: '用户名',
          dataIndex: 'userName',
          key: 'userName',
        }, {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
      }];
      // const data = [{
      //   key: '1',
      //   startTime:'2017-05-02 11:20:14',
      //   operation: '登录成功',
      //   userName:'游龙',
      //   name:'游龙',
      // }];
      return (
          <div className='login_record_container'>
            <LoginRecordTimeSelect getSearchLoginRecord={this.getSearchLoginRecord.bind(this)}></LoginRecordTimeSelect>
            <Table columns={adminLoginRecordColumns} dataSource={this.state.loginData} />
          </div>
      );
    }
}

AdminLoginRecordComp.defaultProps = {
};

AdminLoginRecordComp.propTypes = {
  // allModulesData:React.PropTypes.array,
  // localStoreKey4Modules:React.PropTypes.string
    // params: React.PropTypes.object.isRequired
};

export default AdminLoginRecordComp;
