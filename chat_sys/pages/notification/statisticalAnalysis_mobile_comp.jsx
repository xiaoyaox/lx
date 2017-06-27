//统计分析的移动端
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import superagent from 'superagent';
// import myWebClient from 'client/my_web_client.jsx';
import {  notification } from 'antd';
import {Toast,WhiteSpace} from 'antd-mobile';
import echarts from 'echarts';

notification.config({
  top: 68,
  duration: 3
});
const analysisKey2name_1 = {
  "zcrs":"在册人数",
  "jjrs":"解矫人数",
  "dyrj":"本月入矫",
  "dyjj":"本月解矫",
};
const analysisKey2name_2 = {
  "gz":"管制",
  "hx":"缓刑",
  "js":"假释",
};
const analysisKey2name_3 = {
  "jwzx":"暂予监外执行",
  "bq":"剥夺政治权利",
  "sjdw":"手机定位",
  "bddw":"北斗定位"
};
class StatisticalAnalysisMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        isMobile: Utils.isMobile(),
      };
  }
  getChartOptions = (xAxisData,seriesData)=>{
    return {
          title: {
            x: 'center',
          },
          tooltip: {
              trigger: 'item'
          },
          calculable: true,
          grid: {
              borderWidth: 1,
              y: 80,
              y2: 60
          },
          xAxis: [
              {
                  type: 'category',
                  show: true,
                  data: xAxisData
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  show: true
              }
          ],
          series: [
              {
                  name: '类型数量',
                  type: 'bar',
                  itemStyle: {
                      normal: {
                          color: function(params) {
                              // build a color map as your need.
                              var colorList = [
                                '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                 '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                 '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                              ];
                              return colorList[params.dataIndex]
                          },
                          label: {
                              show: true,
                              position: 'top',
                              formatter: '{b}\n{c}'
                          }
                      }
                  },
                  data: seriesData
              }
          ]
        };
  }
  componentWillMount(){
  }
  componentDidMount(){

    if(this.props.tongjiData){
      this.updateChartData(this.props.tongjiData);
    }else{
      // this.updateChartData({
      //   "hx":"0",
      //   "jjrs":"0",
      //   "dyrj":"0",
      //   "zcrs":"0",
      //   "gz":"0",
      //   "js":"0",
      //   "dyjj":"0",
      //   "jwzx":"0",
      //   "bddw":"",
      //   "bq":"0",
      //   "sjdw":"0"
      // });
    }
  }
  componentWillReceiveProps(nextProps){
    //获取到新的隶属机构Id时，跟新通知列表数据。
    if(nextProps.tongjiData){
      // console.log("componentWillReceiveProps----StatisticalAnalysisComp");
      this.updateChartData(nextProps.tongjiData);
    }
  }
  updateChartData = (valueObj)=>{
    let tongjiData_1 = {};
    let tongjiData_2 = {};
    let tongjiData_3 = {};
    $.each(valueObj,(key,value)=>{
      if(analysisKey2name_1[key]){
        tongjiData_1[analysisKey2name_1[key]] = value || "0";
      }
      if(analysisKey2name_2[key]){
        tongjiData_2[analysisKey2name_2[key]] = value || "0";
      }
      if(analysisKey2name_3[key]){
        tongjiData_3[analysisKey2name_3[key]] = value || "0";
      }
    });
    if(document.getElementById('statisticAnalysis_mobile_1')){
      let myChart = echarts.init(document.getElementById('statisticAnalysis_mobile_1'));
      myChart.setOption( this.getChartOptions(Object.keys(tongjiData_1),Object.values(tongjiData_1)));
    }
    if(document.getElementById('statisticAnalysis_mobile_2')){
      let myChart = echarts.init(document.getElementById('statisticAnalysis_mobile_2'));
      myChart.setOption( this.getChartOptions(Object.keys(tongjiData_2),Object.values(tongjiData_2)));
    }
    if(document.getElementById('statisticAnalysis_mobile_3')){
      let myChart = echarts.init(document.getElementById('statisticAnalysis_mobile_3'));
      myChart.setOption( this.getChartOptions(Object.keys(tongjiData_3),Object.values(tongjiData_3)));
    }
  }

  render(){

    return (
      <div className="statisticAnalysis_mobile_container">
        <div id="statisticAnalysis_mobile_1" style={{height:500,margin:"0 auto",marginTop:10}}></div>
        <div id="statisticAnalysis_mobile_2" style={{height:500,margin:"0 auto",marginTop:10}}></div>
        <div id="statisticAnalysis_mobile_3" style={{height:500,margin:"0 auto",marginTop:10}}></div>
      </div>
    )
  }
}

StatisticalAnalysisMobileComp.defaultProps = {
};

StatisticalAnalysisMobileComp.propTypes = {
  // organId:React.PropTypes.number,
};

export default StatisticalAnalysisMobileComp;
