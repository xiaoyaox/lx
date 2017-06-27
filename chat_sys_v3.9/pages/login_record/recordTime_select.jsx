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
import {Icon, DatePicker } from 'antd';

class LoginRecordTimeSelect extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  handleSearchLoginRecord = () => {
    const {startValue, endValue} = this.state;
    // console.log(startValue, endValue);
    const startTime = null, endTime = null;
    const time = {};
    if (startValue) {
      time.startTime = moment(startValue).valueOf();
    } else if (endValue) {
      time.startTime = moment(endValue).startOf('month').valueOf();
    }
    if (endValue) {
      time.endTime = moment(endValue).valueOf();
    } else if (startValue) {
      time.endTime = moment(startValue).endOf('month').valueOf();
    }
    // console.log(time);
    this.props.getSearchLoginRecord(time);
  }

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div className="range-time">
        <div className="row">
          <div className="col-xs-8 col-md-4">
          <DatePicker
            style={{width: '185px'}}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={startValue}
            placeholder="开始时间"
            onChange={this.onStartChange}
            onOpenChange={this.handleStartOpenChange}
          />
            <DatePicker
              showTime
              style={{width: '185px'}}
              format="YYYY-MM-DD HH:mm:ss"
              value={endValue}
              placeholder="结束时间"
              onChange={this.onEndChange}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange}
            />
          </div>
          <div className="col-xs-4 col-md-8">
            <button className="btn btn-primary comment-btn m-l-10" onClick={this.handleSearchLoginRecord}><Icon type="search" /> 查询</button>
          </div>
        </div>
      </div>
    );
  }
}


export default LoginRecordTimeSelect;
