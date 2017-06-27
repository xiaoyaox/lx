
// deprecated
import $ from 'jquery';
import ReactDOM from 'react-dom';

import React from 'react';
import {Link} from 'react-router/es6';

import { Drawer, List, NavBar,Button } from 'antd-mobile';
import {  Menu, Icon,Affix as AffixPc, Row, Col,Badge } from 'antd';
// import List  from 'antd-mobile/lib/list';

import signup_logo from 'images/signup_logo.png';


class PersonalLoginRecordComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        todayDate:new Date(),
        curYear: props.curYear||2017,
        curMonth:props.curMonth||5,
        todayIndex:{xIndex:-1,yIndex:-1},
        signInRecordData:[],
        calendarData:[],
      };
  }
  componentWillMount() {
    let _this = this;
    // const request = superagent.get('../config/organizations.json')
    //   .then(function(response) {
    //     const body = response.body;
    //     // console.log("request local orgnizasitions:",body);
    //     _this.setState({"organizationsData":body});
    //   });
  }
  getSelectedMonthData(){
      let calendar_data = [];
			let today_index = {xIndex:-1,yIndex:-1};
			let todayInFlag = '';
      let {todayDate, curYear,curMonth} = this.state;
			let todayNum = this.state.todayDate.getDate();
			if(this.todayDate.getFullYear() == this.year){
				if(this.todayDate.getMonth() == this.month-1){
					todayInFlag = 'current';
				}else if(this.todayDate.getMonth()-(this.month-1) ==1){ //今天所在月份如果只比当前显示的月份大一个月，则表示今天就在next month.
					todayInFlag = 'next';
				}
			}
			let i=0,j=0,days=0,dayObj={};
      let monthSumData = this.getSumDaysOfMonth(curYear,curMonth);
      let firstDataWeek = this.getWeekDayByDate(curYear,curMonth,1);
      let rowNum = Math.ceil((monthSumData+firstDataWeek)/7);
			for(i = 0; i < rowNum; i++) {
        calendar_data.push([]);
        for(j=0;j< 7;j++){ // 一个星期只有7天。
					dayObj = this.getBoxNumText(i,j,days);
					days = dayObj.flag=='current'? dayObj.text : days;
					if(todayInFlag==dayObj.flag && todayNum==dayObj.text ){ //判断今天是否在当前显示日历里。
						this.todayIndex = {xIndex:i,yIndex:j};
					}
          this.leftTopPointArr[i][j] = {
						x:this.getBoxXStart(j),
						y:this.getBoxYStart(i),
						flag:dayObj.flag,
						text:dayObj.text
					};
        }
      }
			if(this.isDefaulOpenToday && this.todayIndex.xIndex>=0){ //if enlarge today box default, and todayIndex in current show calendar, then update coordinate.
				this.enlargeBox = {xIndex:this.todayIndex.xIndex,yIndex:this.todayIndex.yIndex};
				for(i = 0; i < this.yBoxNum; i++) {
          for(j=0;j< this.xBoxNum;j++){
						this.leftTopPointArr[i][j]['x'] = this.getBoxXStart(j);
            this.leftTopPointArr[i][j]['y'] = this.getBoxYStart(i);
          }
        }
			}
  }
  getWeekDayByDate(year,month,day){ //得到某年某月某日是在星期几。
    var date = new Date(year+'/'+month+'/'+day);
    return date.getDay();
  }
  getSumDaysOfMonth(year,month){  //得到某年某月有多少天数。
    var  tempDate = new Date(year,month,0);
    return tempDate.getDate();
  }
  getCalendarList(sidebarConfig){
    let ele = [];
    let _this = this;
    const arr = [1,2,3,4,5,6,7];
    let colEle = arr.map((value,i)=>{
                  return (<Col span={3} className="loginRecord_ant_col calendar_body_col">
                    <div className="calendar_body_cnt">
                      <div className="calendar_badge"> <Badge count={value} style={{ backgroundColor: '#87d068'}}/>
                        <span className="login_tag">签到</span>
                      </div>

                    </div>
                  </Col>)
                });
    $.each([0,1,2,3,4,5,6], (index, val)=>{
      ele.push((<Row type="flex" justify="space-around" align="middle" key={index}>
        {colEle}
      </Row>));
    });
    return ele;
  }
  render() {
    const { organizationsData } = this.state;
    const calendarList =  this.getCalendarList();

    return (
        <div>
          <div className="loginRecord_calendar">
            <Row type="flex" justify="space-around" align="middle">
              <Col span={3} className="loginRecord_ant_col calendar_header_col">日</Col>
              <Col span={3} className="loginRecord_ant_col calendar_header_col">一</Col>
              <Col span={3} className="loginRecord_ant_col calendar_header_col">二</Col>
              <Col span={3} className="loginRecord_ant_col calendar_header_col">三</Col>
              <Col span={3} className="loginRecord_ant_col calendar_header_col">四</Col>
              <Col span={3} className="loginRecord_ant_col calendar_header_col">五</Col>
              <Col span={3} className="loginRecord_ant_col calendar_header_col">六</Col>
            </Row>
            {calendarList}
          </div>
        </div>
    );
  }
}

PersonalLoginRecordComp.defaultProps = {
};

PersonalLoginRecordComp.propTypes = {
  // curYear:React.PropTypes.int.isRequired,
  // curMonth:React.PropTypes.int.isRequired
};

export default PersonalLoginRecordComp;
