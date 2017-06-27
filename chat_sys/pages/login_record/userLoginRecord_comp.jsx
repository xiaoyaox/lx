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
import {Icon,message,Calendar} from 'antd';


message.config({
  top: 75,
  duration: 2,
});

class UserLoginRecordComp extends React.Component {
    constructor(props) {
        super(props);
        this.handlePanelChange = this.handlePanelChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.state = {
          todayDate:new Date(),
          curModulesData:null,
          aMonthAgo:moment(new Date()).subtract(30,'days'),
          isMobile:Utils.isMobile(),
          recordData: [],
          calendarValue: moment()
        };
    }

    componentWillMount(){
      document.body.style.overflow = 'hidden';
    }

    componentDidMount(){
      this.getRecordData();
    }

    componentWillUnmount() {
      // document.body.style.overflow = 'auto';
    }

    getRecordData(time) {
      let params = {
        startTime: time ? time.startTime : moment(this.state.todayDate).startOf('month').valueOf(),
        endTime: time ? time.endTime : moment(this.state.todayDate).endOf('month').valueOf(),
        userid: UserStore.getCurrentId()
      };
      // console.log(moment(this.state.todayDate).startOf('month').valueOf());
      myWebClient.getUserLoginRecordData(params,
        (data,res)=>{
          if (res.ok) {
            let array = JSON.parse(res.text);
            console.log("获取用户登录记录数据成功-- data text:",data);
            console.log("获取用户登录记录数据成功-- res text:",res);
            const records = array.map((item) => {
              const time = moment(new Date(item)).format('YYYY-M-D');
              return time;
            });
            this.setState({recordData: records});
            this.setRecordStatus(records);
          }

        },
        (e,err,res)=>{
          message.error("获取用户登录记录数据失败！");
        }
      );
    }

    setRecordStatus(records) {
      if (records) {
        const cells = $('.ant-fullcalendar-table').find('.ant-fullcalendar-cell');
        cells.map((i, cell) => {
          if($(cell).hasClass('cell-record')) {
            $(cell).removeClass('cell-record');
          }
          records.forEach((rec) => {
            if (rec == cell.title) {
              $(cell).addClass('cell-record');
            }
          })
        })
      }
    }

    setSelectRecordStatus(record) {
      const {recordData} = this.state;
      const time = record.format('YYYY-M-D');
      if (record && recordData.indexOf(time) > -1) {
        const cells = $('.ant-fullcalendar-table').find('.ant-fullcalendar-cell');
        cells.map((i, cell) => {
          if (time == cell.title) {
            $(cell).addClass('cell-record');
          }
        })
      }
    }

    dateCellRender = ()=>{

    }

    onMobilePanelChange = ()=>{

    }

    handlePanelChange(value, mode) {
      if (mode == 'year') {
        return;
      }
      // const currentTime = this.state.calendarValue.startOf('month').valueOf();
      // console.log(value);
      this.setState({calendarValue: value}, () => {
        const cur = value.format('YYYY-MM-DD');
        const currentTime = this.state.calendarValue.format('YYYY-MM-DD');
        const time = {
          startTime: moment(cur).startOf('month').valueOf(),
          endTime: moment(cur).endOf('month').valueOf()
        }
        if (time.startTime == moment(currentTime).startOf('month').valueOf()) {
          this.setRecordStatus(this.state.recordData);
          return;
        }
        this.getRecordData(time);
      });
    }

    handleSelect(value) {
      this.handlePanelChange(value);
    }

    getMobileElements(){
      return (<div style={{  border: '1px solid #d9d9d9', borderRadius: 4 }} className="mobile_userLoginRecord">
        <Calendar dateCellRender={this.dateCellRender} onPanelChange={this.handlePanelChange} onSelect={this.handleSelect} />
              </div>);
    }

    getPCElements(){
      return (<div style={{width:'100%',margin:'10px auto'}}>
        <Calendar dateCellRender={this.dateCellRender} onPanelChange={this.handlePanelChange} onSelect={this.handleSelect}/>
      </div>);
    }

    render() {
      let listItem =[];
      let eles = this.state.isMobile ? this.getMobileElements() : this.getPCElements();
      return (
          <div className='container userLoginRecord_container' style={{width:'100%'}}>
            {eles}
          </div>
      );
    }
}

UserLoginRecordComp.defaultProps = {
};
UserLoginRecordComp.propTypes = {
  // allModulesData:React.PropTypes.array,
  // localStoreKey4Modules:React.PropTypes.string
    // params: React.PropTypes.object.isRequired
};

export default UserLoginRecordComp;
