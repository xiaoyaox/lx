import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import superagent from 'superagent';
// import myWebClient from 'client/my_web_client.jsx';
import {  notification } from 'antd';
import {Toast} from 'antd-mobile';
import echarts from 'echarts';
import ERecordisMobileComp from './eRecord_mobile_comp.jsx';
import ERecordisPcComp from './eRecord_pc_comp.jsx';
const urlPrefix = 'http://211.138.238.83:9000/CS_JrlService/';

notification.config({
  top: 68,
  duration: 3
});


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

  render(){
  let echartView=this.state.isMobile ?
  (<ERecordisMobileComp
    eRecordData={this.props.eRecordData}
    redressOrganId={this.props.redressOrganId}
    organListData={this.props.organListData}
    handleSearchDocument={this.props.handleSearchDocument}
    />) :
  (<div className="ERecordPcStyle">
         <ERecordisPcComp
          redressOrganId={this.props.redressOrganId}
          eRecordData={this.props.eRecordData}
          organListData={this.props.organListData}
          handleSearchDocument={this.props.handleSearchDocument}
          />
   </div>);
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
