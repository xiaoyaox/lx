//发文管理的详情页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WingBlank, WhiteSpace, Button, NavBar, TabBar, Toast } from 'antd-mobile';

import {Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

import * as GlobalActions from 'actions/global_actions.jsx';
import DS_EditContentComp from './ds_edit_content_comp.jsx';
import BottomTabBarComp from './signReport/bottomTabBar_comp.jsx';
import DS_SendContentComp from './ds_send_content_comp.jsx';//发文详情页-- 发送
import CommonVerifyComp from './common_verify_comp.jsx';
import DS_MainContentComp from './ds_main_content_comp.jsx';//发文详情页-- 正文
import DS_UploadContentComp from './ds_upload_content_comp.jsx';//发文详情页-- 上传附件
import DS_FlowContentComp from './ds_flow_content_comp.jsx';//发文详情页-- 查看流程

const zhNow = moment().locale('zh-cn').utcOffset(8);

class DS_DetailComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.onNavBarRightClick = this.onNavBarRightClick.bind(this);
      this.state = {
        date: zhNow,
        moduleNameCn:'发文管理',
        modulename:'fwgl', //模块名
        subTabsArr:["","content"], // such as :["","content","send","verify"]
        curSubTab:'content',
        isHide:false,
        formData:null,
        formDataRaw: null
      };
  }
  componentWillMount(){
    if(this.props.detailInfo && this.props.detailInfo.unid){
      this.getServerFormData();
    }
  }

  getServerFormData = ()=>{
    OAUtils.getModuleFormData({
      moduleName:this.state.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.detailInfo.unid,
      successCall: (data)=>{
        console.log("get 发文管理的表单数据:",data);
        let formDataRaw = data.values;
        let formData = this.formatServerListData(data.values);
        this.setState({
          formData,
          formDataRaw
        });
      }
    });
  }
  formatServerListData = (values)=>{
    let formData = {};
    Object.keys(values).forEach((key)=>{
      if(typeof values[key] == "object"){
        formData[key] = values[key].value;
      }else{
        formData[key] = values[key];
      }
    });
    return formData;
  }
  onNavBarLeftClick = (e) => {
    this.setState({isHide:true});
    console.log("当前目录：", this.state.curSubTab);
    if(this.state.curSubTab === "content"){
      this.props.backToTableListCall();
    }else{
      this.setState({curSubTab:'content'});
    }
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

  onBackSendContentCall = () => {
    this.setState({curSubTab:'send'});
  }

  renderContent = (pageText)=> {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>你已点击“{pageText}” tab， 当前展示“{pageText}”信息</div>
        <a style={{ display: 'block', marginTop: 40, marginBottom: 600, color: '#108ee9' }}
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              hidden: !this.state.hidden,
            });
          }}
        >
          点击切换 tab-bar 显示/隐藏
        </a>
      </div>
    );
  }

  onClickSave = ()=> {
    Toast.info('保存成功!', 1);
    this.props.backToTableListCall();
    let form = this.props.form;
  }

  onClickSubTab = (data)=>{
    // console.log("onClickSubTab-target:",e.target);
    let tabNameCn = data.replace(/\s+/g,"");
    let tabNameCn2En = {"发送":"send", "上传附件":"upload", "正文":"article", "查阅附件":"referto"}
    this.afterChangeTabCall(tabNameCn2En[tabNameCn]);
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
     const { detailInfo } = this.props;
     const formData = this.state.formData || {};
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
          ]} >
          发文处理单
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content" ?
          (<DS_EditContentComp
            tokenunid={this.props.tokenunid}
            afterChangeTabCall={this.afterChangeTabCall}
            backToTableListCall={()=>this.props.backToTableListCall()} />):null}
            <div className="custom_tabBar" id="FW">
              <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
                hidden={this.state.hidden}>
                <TabBar.Item
                  icon={<Icon type="save" size="lg" />}
                  selectedIcon={<Icon type="save" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
                  title="保存"
                  key="保存"
                  selected={this.state.selectedTab === 'redTab'}
                  onPress={() => this.onClickSave()}
                  data-seed="logId1">
                  {this.renderContent('保存')}
                </TabBar.Item>
                <TabBar.Item
                  title="正文"
                  key="正文"
                  icon={
                    <Icon type="left-circle" size="lg" />
                  }
                  selectedIcon={
                    <Icon type="left-circle" size="lg" style={{color:"rgb(51, 163, 244)"}} />
                  }
                  selected={this.state.selectedTab === 'blueTab'}
                  onPress={() => this.onClickSubTab("正文")}
                  data-seed="logId">
                  {this.renderContent('正文')}
                </TabBar.Item>
                <TabBar.Item
                  icon={<Icon type="upload" size="lg" />}
                  selectedIcon={<Icon type="upload" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
                  title="上传附件"
                  key="上传附件"
                  selected={this.state.selectedTab === 'greenTab'}
                  onPress={() => this.onClickSubTab("上传附件")}>
                  {this.renderContent('上传附件')}
                </TabBar.Item>
                <TabBar.Item
                  icon={<Icon type="export" size="lg" />}
                  selectedIcon={<Icon type="export" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
                  title="发送"
                  key="发送"
                  selected={this.state.selectedTab === 'yellowTab'}
                  onPress={() => this.onClickSubTab("发送")}>
                  {this.renderContent('发送')}
                </TabBar.Item>
              </TabBar>
            </div>
            {this.state.curSubTab == "send"?
              (<DS_SendContentComp
                  tokenunid={this.props.tokenunid}              
                  backSendContentCall={this.onBackSendContentCall}
                  backDetailCall={this.onBackDetailCall}
                  isShow={true}/>):null}
            {this.state.curSubTab == "verify"?
              (<CommonVerifyComp
                tokenunid={this.props.tokenunid}
                backDetailCall={this.onBackDetailCall}
                isShow={true}/>):null}
            {this.state.curSubTab == "upload"?
              (<DS_UploadContentComp
                tokenunid={this.props.tokenunid}
                backDetailCall={this.onBackDetailCall} isShow={true}/>):null}
            {this.state.curSubTab == "article"?
              (<DS_MainContentComp
                tokenunid={this.props.tokenunid}
                backDetailCall={this.onBackDetailCall} isShow={true}/>):null}
        </div>
      </div>
    )
  }
}

DS_DetailComp.defaultProps = {
};

DS_DetailComp.propTypes = {
  // onBackDetailCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default DS_DetailComp;
