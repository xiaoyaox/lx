import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import superagent from 'superagent';
// import myWebClient from 'client/my_web_client.jsx';
import {  notification } from 'antd';
import {Toast} from 'antd-mobile';
import echarts from 'echarts';
import StatisticalAnalysisMobileComp from './statisticalAnalysis_mobile_comp.jsx';
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
class StatisticalAnalysisComp extends React.Component {
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
          // toolbox: {
          //     show: true,
          //     feature: {
          //         dataView: {show: true, readOnly: false},
          //         restore: {show: true},
          //         saveAsImage: {show: true}
          //     }
          // },
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
      this.updateChartData({
        "hx":"0",
        "jjrs":"0",
        "dyrj":"0",
        "zcrs":"0",
        "gz":"0",
        "js":"0",
        "dyjj":"0",
        "jwzx":"0",
        "bddw":"",
        "bq":"0",
        "sjdw":"0"
      });
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
  (<StatisticalAnalysisMobileComp tongjiData={this.props.tongjiData}/>) :
  (<div id="tongjiChartsMainContaner" style={{height:600,margin:"0 auto",marginTop:30}}></div>);
    return (
      <div className="notificationdetai_container">
        <span style={{fontSize:"2em",width:'100%',marginTop:22,color:'black',fontWeight:'bold'}}>统计分析类型数量</span>
        {echartView}
      </div>
    )
  }
}

StatisticalAnalysisComp.defaultProps = {
};

StatisticalAnalysisComp.propTypes = {
};

export default StatisticalAnalysisComp;
