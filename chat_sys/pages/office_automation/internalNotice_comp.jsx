//对内宣传
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import superagent from 'superagent';
import myWebClient from 'client/my_web_client.jsx';
import {Link} from 'react-router/es6';
import { Button, WhiteSpace, List, InputItem, TextareaItem,DatePicker} from 'antd-mobile';
import { Icon} from 'antd';
import {createForm} from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';

const zhNow = moment().locale('zh-cn').utcOffset(8);
const maxDate = moment('2117-12-03 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('2016-06-06 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const maxTime = moment('23:59 +0800', 'HH:mm Z').utcOffset(8);
const minTime = moment('00:00 +0800', 'HH:mm Z').utcOffset(8);

const gmtNow = moment().utcOffset(0);
//已废弃不用。
class InternalNoticeCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.getBodyPages = this.getBodyPages.bind(this);
      this.state = {
        isMobile: Utils.isMobile(),
        listData:[],
        date: zhNow,
        dpValue: null,
        visible: false,
      };
  }
  componentWillMount(){

  }
  onChange = (date) => {
    // console.log('onChange', date);
    this.setState({
      date,
    });
  }
  getBodyPages(){
    const { getFieldProps } = this.props.form;
    let todayDate=moment().format('ll');
      let bodyMobilePages=(
        <div className="bodyContent">
            <InputItem clear
            placeholder="请输入"
                autoFocus
            >起草人:
            </InputItem>
            <TextareaItem
               title="消息内容:"
               placeholder="请输入"
               autoHeight
            />
            <List>
              <DatePicker
                mode="date"
                title="选择日期"
                extra="可选,小于结束日期"
                {...getFieldProps('date1', {

                })}
                minDate={minDate}
                maxDate={maxDate}
              >
                <List.Item arrow="horizontal">消息创建日期:</List.Item>
              </DatePicker>
            </List>
            <WhiteSpace size="lg" />
            <Button type="primary" size="middle"
            style={{width:'90%',margin:'1em auto'}}>发送</Button>
        </div>
      );
        return bodyMobilePages;
  }

  render() {
  let bodyPages=this.getBodyPages();
    return (
      <div>
        {bodyPages}
      </div>
    )
  }
}

InternalNoticeCompRaw.defaultProps = {
};

InternalNoticeCompRaw.propTypes = {
};
const InternalNoticeComp = createForm()(InternalNoticeCompRaw);
export default InternalNoticeComp;
