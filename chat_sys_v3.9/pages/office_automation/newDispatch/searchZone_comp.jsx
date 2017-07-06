import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { createForm } from 'rc-form';
import { Modal,WhiteSpace, SwipeAction, Flex,Button,
  Tabs, RefreshControl, ListView,SearchBar,Picker,
  List,NavBar,DatePicker,InputItem} from 'antd-mobile';
import { Icon} from 'antd';
import moment from 'moment';
//查询区组件
class SearchZoneComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        curYearMonth:moment(new Date()),
        maxYearMonth:moment(new Date()).add(1,'months'),
        minYearMonth:moment(new Date()).subtract(4,'years'),
        beginTime:null,
        endTime:null,
        departmentPickers:[]
      };
  }
  componentWillMount(){
    let curDepartmentUnid='';
    let departmentPickers = this.props.departmentSource.map((item)=>{
      if(item.commonname == "148中心"){
        curDepartmentUnid = item.unid;
      }
      return {
        label:item.commonname,
        value:item.unid
      };
    });
    this.setState({
      departmentPickers:departmentPickers,
      curDepartmentUnid:curDepartmentUnid,
    })
  }
  componentWillReceiveProps(nextState){
  }
  // updateSearchParams = (params)=>{
  //   this.props.updateSearchParams(params);
  // }
  onYearMonthChange = (yearMonth)=>{
    console.log("yearMonth:",yearMonth);
    this.setState({curYearMonth:yearMonth});
    this.props.updateSearchParams({
      year:yearMonth.format("YYYY"),
      month:yearMonth.format("MM"),
    });
  }
  onDepartmentChange = (depart)=>{
    console.log("curDepartmentUnid:",depart);
    this.setState({
      curDepartmentUnid:depart[0]
    })
    this.props.updateSearchParams({
      department:depart[0]
    });
  }
  onBeginTimeChange = (beginTime) => { //开始日期
    this.setState({
      beginTime,
    });
  }
  onEndTimeChange = (endTime) => { //结束日期
    this.setState({
      endTime,
    });
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const {departmentPickers} = this.state;

    let yearMonthSource=(
      <div className={'oa_detail_cnt'}>
        <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <DatePicker
                  mode="date"
                  title="选择日期"
                  extra="请选择"
                  value={this.state.curYearMonth}
                  minDate={this.state.minYearMonth}
                  maxDate={this.state.maxYearMonth}
                  onChange={this.onYearMonthChange}
                >
                  <List.Item arrow="horizontal">选择年月:</List.Item>
                </DatePicker>
              </div>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    );
    let sponsorDepartmentSource=(
      <div className={'oa_detail_cnt'}>
        <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={departmentPickers} cols={1}
                  title="选择主办部门"
                  value={[this.state.curDepartmentUnid]}
                  onChange={this.onDepartmentChange}
                  >
                  <List.Item arrow="horizontal">按主办部门:</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    );
    let combinationSearch=(
          <div className={'oa_detail_cnt'}>
            <div style={{marginLeft:'-0.1rem',marginRight:'-0.2rem'}}>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                        <InputItem
                        editable={true} labelNumber={2} placeholder="标题">标题</InputItem>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                        <InputItem
                        editable={true} labelNumber={4} placeholder="拟稿单位">拟稿单位</InputItem>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                        <InputItem
                        editable={true} labelNumber={4} placeholder="发文文号">发文文号
                        </InputItem>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onBeginTimeChange}
                        value={this.state.beginTime}
                      >
                      <List.Item arrow="horizontal">成文起始日期</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <div style={{borderBottom: '1px solid #ddd'}}>
                      <DatePicker className="forss"
                        mode="date"
                        onChange={this.onEndTimeChange}
                        value={this.state.endTime}
                      >
                      <List.Item arrow="horizontal">成文结束日期</List.Item>
                      </DatePicker>
                    </div>
                  </Flex.Item>
                </Flex>
              </div>
                <Button type="primary" style={{margin:'0 auto',marginTop:'0.1rem',width:'90%',marginBottom:'0.1rem'}}
                ><Icon type="search" />查询</Button>
            </div>
    );
    let searchEle=null;
    switch(this.props.tabName){
      // case "按日期":
      case "按年度":
        searchEle = yearMonthSource;
        break;
      case "按主办部门":
        searchEle = sponsorDepartmentSource;
        break;
      case "组合查询":
        searchEle = combinationSearch;
        break;
      default:
        break;
    }
    return (
      <div>
        {searchEle}
      </div>
    )
  }
}

SearchZoneComp.defaultProps = {
};
SearchZoneComp.propTypes = {
};

export default createForm()(SearchZoneComp);
