//公文报送的详情页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { WingBlank, WhiteSpace, Button, NavBar } from 'antd-mobile';
import { Icon } from 'antd';

import moment from 'moment';
import 'moment/locale/zh-cn';

import * as GlobalActions from 'actions/global_actions.jsx';
import DS_DetailContentComp from './ds_detail_content_comp.jsx';
import CommonSendComp from './common_send_comp.jsx';
import CommonVerifyComp from './common_verify_comp.jsx';

import DS_MainContentComp from './ds_main_content_comp.jsx';//发文详情页-- 正文
import DS_UploadContentComp from './ds_upload_content_comp.jsx';//发文详情页-- 上传附件
import DS_SendContentComp from './ds_send_content_comp.jsx';//发文详情页-- 发送
import DS_FlowContentComp from './ds_flow_content_comp.jsx';//发文详情页-- 查看流程

const zhNow = moment().locale('zh-cn').utcOffset(8);

class DS_EditComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.onNavBarRightClick = this.onNavBarRightClick.bind(this);
      this.state = {
        date: zhNow,
        subTabsArr:["","content"], // such as :["","content","send","verify"]
        curSubTab:'content',
        isHide:false,
      };
  }
  componentWillMount(){
  }
  onNavBarLeftClick = (e) => {
    this.setState({isHide:true});
    this.props.backToTableListCall();
    // setTimeout(()=>this.props.backToTableListCall(),1000);
  }
  onNavBarRightClick = (...args) => {
    GlobalActions.emitUserLoggedOutEvent();
  }
  onClickCancelBack = ()=>{
    let {subTabsArr} = this.state;
    // subTabsArr.pop();
    // let curSubTab = subTabsArr[subTabsArr.length-1];
    // this.setState({curSubTab:curSubTab});
    // if(!curSubTab){
    //   // this.props.backToTableListCall();
    //   this.setState({
    //     subTabsArr:["","content"],
    //     curSubTab:"content",
    //   });
    // }
  }
  onBackDetailCall = ()=>{
    this.setState({curSubTab:'content'});
  }
  afterChangeTabCall = (tabname)=>{ //切换tab。
    let {subTabsArr} = this.state;
    subTabsArr.push(tabname);
    this.setState({
      curSubTab:tabname,
      subTabsArr,
    });
  }

  render() {
     const detailInfo = {};
    //  let clsName = this.props.isShow && !this.state.isHide?
    //  'oa_detail_container ds_detail_container oa_detail_container_show':
    //  'oa_detail_container ds_detail_container oa_detail_container_hide';
    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]}
          rightContent={[
            <Icon key={1} type="logout" onClick={this.onNavBarRightClick}/>,
            <span key={2} onClick={this.onNavBarRightClick}>退出</span>
          ]}>
          发文处理单
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content"? (<DS_DetailContentComp detailInfo={detailInfo} afterChangeTabCall={this.afterChangeTabCall} backToTableListCall={()=>this.props.backToTableListCall()} />):null}
        </div>
        {this.state.curSubTab == "send"? (<DS_SendContentComp backSendContentCall={this.onBackSendContentCall} backDetailCall={this.onBackDetailCall}  isShow={true}/>):null}
        {this.state.curSubTab == "verify"? (<CommonVerifyComp backDetailCall={this.onBackDetailCall} isShow={true}/>):null}
        {this.state.curSubTab == "upload"? (<DS_UploadContentComp backDetailCall={this.onBackDetailCall} isShow={true}/>):null}
        {this.state.curSubTab == "article"? (<DS_MainContentComp backDetailCall={this.onBackDetailCall} isShow={true}/>):null}
      </div>
    )
  }
}

DS_EditComp.defaultProps = {
};

DS_EditComp.propTypes = {
  onBackDetailCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default DS_EditComp;
