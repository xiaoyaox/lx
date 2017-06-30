import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import superagent from 'superagent';
// import myWebClient from 'client/my_web_client.jsx';
import {  notification } from 'antd';
import {Toast} from 'antd-mobile';
import echarts from 'echarts';
import ERecordisMobileComp from './eRecord_mobile_comp.jsx';
const urlPrefix = 'http://211.138.238.83:9000/CS_JrlService/';

notification.config({
  top: 68,
  duration: 3
});
const analysisKey2name = {
  "zcrs":"在册人数",
  "jjrs":"解矫人数",
  "dyrj":"本月入矫",
  "dyjj":"本月解矫",
  "gz":"管制",
  "hx":"缓刑",
  "js":"假释",
  "jwzx":"暂予监外执行",
  "bq":"剥夺政治权利",
  "sjdw":"手机定位",
  "bddw":"北斗定位"
};

//矫正系统的统计分析。
class ERecordComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        isMobile: Utils.isMobile(),
      };
  }
  componentWillMount(){
  }
  componentDidMount(){
  }
  componentWillReceiveProps(nextProps){

  }
  updateChartData = (valueObj)=>{
    let tongjiData = {};
    $.each(valueObj,(key,value)=>{
      tongjiData[analysisKey2name[key]] = value || "0";
    });
    if(document.getElementById('tongjiChartsMainContaner')){
      let myChart = echarts.init(document.getElementById('tongjiChartsMainContaner'));
      myChart.setOption( this.getChartOptions(Object.keys(tongjiData),Object.values(tongjiData)));
    }
  }

  render(){
  let echartView=this.state.isMobile ?
  (<ERecordisMobileComp
    eRecordData={this.props.eRecordData}
    redressOrganId={this.props.redressOrganId}
    organListData={this.props.organListData}
    handleSearchDocument={this.props.handleSearchDocument}
    />) :
  (<ERecordisMobileComp
    redressOrganId={this.props.redressOrganId}
    eRecordData={this.props.eRecordData}
    organListData={this.props.organListData}
    handleSearchDocument={this.props.handleSearchDocument}
    />);
    return (
      <div className="notificationdetai_container">
        {echartView}
      </div>
    )
  }
}

ERecordComp.defaultProps = {
};

ERecordComp.propTypes = {
};

export default ERecordComp;
