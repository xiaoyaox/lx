//系统设置页面，只有PC端的。
import $ from 'jquery';

import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import TeamStore from 'stores/team_store.jsx';
import UserStore from 'stores/user_store.jsx';

import * as organizationUtils from 'pages/utils/organization_utils.jsx';
import LogOutComp from './components/log_out_comp.jsx';

import client from 'client/web_client.jsx';
import myWebClient from 'client/my_web_client.jsx';
import SysUsersListComp from './sys_config/sysUsersList_comp.jsx';
import SysUsersListMobileComp from './sys_config/sysUsersList_mobile_comp.jsx';
import AddEditSysConfigDialog from './sys_config/addEdit_dialog.jsx';
import ModifyUserPasswordDialog from './sys_config/modifyPassword_dialog.jsx';
import UserSearchZoneComp from './sys_config/userSearchZone_comp.jsx';

import OrganizationManagePage from './sys_config/organizationManage_page.jsx';
// import UserManagePage from './sys_config/userManage_page.jsx'; //暂时没用，后期有时间加上吧。

import { Drawer, List, NavBar,Button,InputItem, Radio as RadioAm, Popup } from 'antd-mobile';
const { RadioItem  } = RadioAm;

import { Layout, Menu, Breadcrumb, Icon,Affix as AffixPc , Form, Input, Radio,
  Row, Col, Button as ButtonPc, Table, Modal, DatePicker,notification } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider,footer } = Layout;
// import List  from 'antd-mobile/lib/list';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
import signup_logo from 'images/signup_logo.png';

const Item = List.Item;
const Brief = Item.Brief;
class SysConfigPage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.hideAddEditDialog = this.hideAddEditDialog.bind(this);
        this.showAddEditDialog = this.showAddEditDialog.bind(this);
        this.hideModifyPasswordDialog = this.hideModifyPasswordDialog.bind(this);
        this.showModifyPasswordDialog = this.showModifyPasswordDialog.bind(this);
        this.afterDeleteUserCall = this.afterDeleteUserCall.bind(this);
        this.afterAddEditUserCall = this.afterAddEditUserCall.bind(this);
        this.updateUserListOnSearch = this.updateUserListOnSearch.bind(this);
        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
        return {
            menuTab:0,
            current: '1',
            loginUserName:'',
            visibleEditModel: false,
              visiblePasswordModel: false,
            userListData: [],
            menberInfo: {}
        };
    }
    componentWillMount() {
      var me = UserStore.getCurrentUser() || {};
      this.setState({loginUserName:me.username || ''});
      this.getServerUsersData();
      // console.log("sysconfig --componentWillMount--");
      organizationUtils.getServerOrganizationsData();
    }
// menu handler
handleClick = (item) => {
   if(item.key==1){
     this.setState({  current: "1",menuTab:0});}
   else if(item.key==2){
     this.setState({  current: "2",menuTab:1});
   }

 }
  onClickBackToModules(){
    browserHistory.push('/modules');
  }

  getServerUsersData(params){
    let _this = this;
    myWebClient.getUsersData(params||{},
      (data,res)=>{
        let objArr = JSON.parse(res.text);
        // console.log("获取用户信息 success:",objArr);
        this.setState({"userListData":this.parseUsersData(objArr)});
      },(e, err, res)=>{
        _this.openNotification('error', '获取用户信息失败了！');
        console.log("获取用户信息 error info:",err);
      });
  }
  parseUsersData(userDatas){
    return userDatas.map((userDt)=>{
      let obj = {...userDt};
      obj.key = obj.id;
      return obj;
    });
  }
  afterAddEditUserCall(){ //在新增和编辑后跟新列表。
    this.getServerUsersData();
  }
  getMobileElements(sidebar){
    const drawerProps = {
      open: this.state.open,
      position: this.state.position,
      onOpenChange: this.onOpenChange,
    };
    let contentAll = this.getListContentElements();
    return (<div><Button type="primary" inline onClick={() => this.onOpenChange()} style={{ marginRight: '0.08rem',position:'absolute',top:'0',right:'0',zIndex:'3'}} >...</Button>
        <Drawer
          style={{ minHeight: document.documentElement.clientHeight - 200 }}
          touch={true}
          sidebarStyle={{height:'100%',background:'#fff'}}
          contentStyle={{ color: '#A6A6A6'}}
          sidebar={sidebar}
          {...drawerProps} >
          <NavBar className="mobile_navbar_custom"
            iconName = {false}
            leftContent={[ <Icon type="arrow-left" className="back_arrow_icon"/>,<span style={{fontSize:'0.8em'}}>返回</span>]}
            onLeftClick={this.onNavBarLeftClick}
            rightContent={[ <Icon key="1" type="ellipsis" onClick={this.onOpenChange}/>]}>
            <img width="30" height="30" src={signup_logo} style={{marginRight:22}}/>
              司法E通
          </NavBar>
          {contentAll}
        </Drawer></div>);

  }

  getPCElements(sidebar){
    let contentAll = this.getListContentElements();
    let headerName = this.state.menuTab==0 ? "用户管理" : "组织管理";

    return ( <Layout style={{ height: '100vh' }}>
              <Header className="header custom_ant_header" style={{position:'fixed',width:'100%',zIndex:'13'}}>
                <div className="custom_ant_header_logo" onClick={this.onClickBackToModules} style={{padding:'0px'}}>
                  <span className="logo_icon"><img width="40" height="40" src={signup_logo}/></span>
                  <div className="logo_title">
                    <p>@{this.state.loginUserName}</p><p>司法E通</p>
                    </div>
                </div>
                <div className="sysHeader"> <h5>{headerName}</h5> </div>
                <div className="" style={{position:'absolute',right:'32px',top:'0'}}><LogOutComp className="" addGoBackBtn/></div>
              </Header>
              <Layout style={{marginTop:'64px'}}>
                {sidebar}
                <Layout style={{ padding: '0' }}>
                  <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280,overflow: 'initial' }}>
                    {contentAll}
                  </Content>
                </Layout>
              </Layout>
        </Layout>);
  }
  afterDeleteUserCall(){
    this.getServerUsersData();
  }

  updateUserListOnSearch(data){  //点击用户搜索后的回调，更新用户列表数据。
    let params = data||{};

    myWebClient.getSearchUsersData(params,(data,res)=>{
      let objArr = JSON.parse(res.text);
      // console.log("获取查询的用户信息 success:",objArr);
      this.setState({"userListData":this.parseUsersData(objArr)});
      if(objArr && objArr.length>0){
        this.openNotification('success', '获取查询的用户信息成功！');

      }else{
        this.openNotification('warning', '没有查询到相关用户信息！');
      }
    },(e,err,res)=>{
      this.openNotification('error', '获取用户信息失败！');
      // console.log("获取查询的用户信息 error:",err);
    });
  }

  getUserListTable(){
    const {userListData} = this.state;
    return (
      <SysUsersListComp userListData={userListData}
        afterDeleteUserCall={this.afterDeleteUserCall}
        showAddEditDialog={(data)=>{this.showAddEditDialog(data)}}
        showModifyPasswordDialog={(data)=>{this.showModifyPasswordDialog(data)}}
        className="sysdoc-search-list">
      </SysUsersListComp>
    );
    // return (
    //     <SysUsersListMobileComp
    //         userListData={userListData}
    //         afterDeleteUserCall={this.afterDeleteUserCall}
    //         showAddEditDialog={(data)=>{this.showAddEditDialog(data)}}
    //         showModifyPasswordDialog={(data)=>{this.showModifyPasswordDialog(data)}}
    //     />
    //   )
  }
  getListContentElements(){ //右侧主内容区
    let userListTable = this.getUserListTable();
    let content;
    if(this.state.menuTab==0){
      content = (<div>
                  <UserSearchZoneComp updateUserListOnSearch={(data)=>{this.updateUserListOnSearch(data)}}/>
                  {userListTable}
                </div>);
    }else if(this.state.menuTab==1){
      content = (<div>
                  <OrganizationManagePage/>
                </div>);
    }
    return content;
  }

  showAddEditDialog(data) { //显示新增/编辑的弹窗
    this.setState({ menberInfo: data,visibleEditModel: true });
  }
  showModifyPasswordDialog(data) { //显示新增/编辑的弹窗
    this.setState({ menberInfo: data, visiblePasswordModel: true });
  }

  hideAddEditDialog() {   // 隐藏新增Or编辑的弹窗。
    this.setState({ visibleEditModel: false });
  }
  hideModifyPasswordDialog() {   // 隐藏新增Or编辑的弹窗。
    this.setState({ visiblePasswordModel: false });
  }
  openNotification(type, message) {
    notification.config({
      top: 68,
      duration: 3
    });
    notification[type]({
      message: message,
      // description: ''
    });
  }
  render(){
    const sidebar = (
      <Sider width={240} className="custom_ant_sidebar"
        style={{ background: '#2071a7',color:'#fff',overflow: 'auto' }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[this.state.current]}
          style={{ width: 240}}
          onClick={this.handleClick}
        >
            <Menu.Item key="1"><Icon type="user" />用户管理</Menu.Item>
            <Menu.Item key="2"><Icon type="team"/>组织管理</Menu.Item>
        </Menu>
      </Sider>
    )

    const {visibleEditModel,visiblePasswordModel, menberInfo} = this.state;

    // let finalEle = this.state.isMobile ? this.getMobileElements(sidebar) : this.getPCElements (sidebar);
    let finalEle = this.getPCElements (sidebar);
    return (<div className="sys_config_container">
      {finalEle}
      <ModifyUserPasswordDialog
        visible={visiblePasswordModel}
        menberInfo={menberInfo}
        closeDialogCall={this.hideModifyPasswordDialog}
        afterModifyPasswordCall={this.afterAddEditUserCall}
        ></ModifyUserPasswordDialog>
      <AddEditSysConfigDialog
        visible={visibleEditModel}
        menberInfo={menberInfo}
        closeDialogCall={this.hideAddEditDialog}
        afterAddEditUserCall={this.afterAddEditUserCall}
        ></AddEditSysConfigDialog>
    </div>);
  }
}

SysConfigPage.defaultProps = {
};

SysConfigPage.propTypes = {
};

export default SysConfigPage;
