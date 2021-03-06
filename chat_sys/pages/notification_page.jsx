//矫正系统页面
import $ from 'jquery';

import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import request from 'superagent';
import LogOutComp from './components/log_out_comp.jsx';

import { Drawer, List, NavBar,Button,Toast } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Icon,notification} from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider ,Footer} = Layout;

import StatisticalAnalysisComp from './notification/statisticalAnalysis_comp.jsx'; //统计分析
import NoticeComp from './notification/notice_comp.jsx'; //通知公告

import signup_logo from 'images/signup_logo.png';
import logOut_icon from 'images/modules_img/logOut_icon.png';
const Item = List.Item;
const Brief = Item.Brief;
const urlPrefix = 'http://211.138.238.83:9000/CS_JrlService/';

notification.config({
  top: 68,
  duration: 3
});

class NotificationPage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.state = this.getStateFromStores();
        this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
    }
    getStateFromStores() {
        return {
            open: false,
            menuTab:0,
            current: '1',
            position: 'left',
            userId:'',
            organName:'',
            organFlag:'',
            loginUserName:'', // 矫正系统里的用户名。
            loginPassword:'', // 矫正系统的用户密码。
            redressOrganId:'', //矫正系统里的组织机构Id.
            noticeListData:null,
            tongjiData:null, //统计分析的数据
            isMobile: Utils.isMobile()
        };
    }
    onNavBarLeftClick = () => {
      browserHistory.push('/');
    }
    onSidebarMenuClick = (item) => {
      if(item.key==1){
        this.setState({  current: "1",menuTab:0}); }
      else if(item.key==2){
        this.setState({  current: "2",menuTab:1});
      }

    }
    onClickBackToModules(){
      browserHistory.push('/modules');
    }
    componentWillMount() {
      var me = UserStore.getCurrentUser() || {};
      this.setState({loginUserName:me.redressUserName || 'csjz05'});
      this.setState({loginPassword:me.redressPassword || '2016'});
      //登录的接口。
      let params = {
        loginName:`${me.redressUserName || 'csjz05'}`,
        loginPwd:`${me.redressPassword || '2016'}`
      };
      // let params = {'param':encodeURIComponent(JSON.stringify(params))};
      $.post(`${urlPrefix}/android/datb/login.action`,params,
          (data,state)=>{
              //这里显示从服务器返回的数据
              let res = decodeURIComponent(data);
              try{
                 res = JSON.parse(res);
              }catch(e){
              }
              if(res.respCode != "0"){ //登录失败。
                this.state.isMobile ?
                  Toast.info(res.respMsg, 2, null, false):
                  notification.error({message: '矫正系统登录失败，'+res.respMsg});
              }else{ //登录成功。
                let values = res.values[0];
                this.setState({
                  userId:values.userId,
                  redressOrganId:values.organId, //隶属机构Id。
                  organName:values.organ,  //隶属机构名
                  organFlag:values.flag,  //隶属机构标识级别。组织机构标识：1、市 2、区 3、县 4、乡镇 5、街道
                });
              }
              console.log("矫正系统的登录返回---：",res,state);
          }
      );
    }
    onOpenChange = (...args) => {
      // console.log(args);
      this.setState({ open: !this.state.open });
    }
    getServerAnalysisData = (organId,currentIndex)=>{
      $.get(`${urlPrefix}/android/manager/getTongJiList.action?organId=${organId}`,
        {},(data,state)=>{
          //这里显示从服务器返回的数据
          let res = decodeURIComponent(data);
          try{
             res = JSON.parse(res);
          }catch(e){
          }
          console.log("矫正系统的获取统计分析的返回---：",res,state);
          if(res.respCode != "0"){
            this.state.isMobile ?
              Toast.info(res.respMsg, 2, null, false):
              notification.error({message: '获取统计分析数据失败，'+res.respMsg});
          }else{
            let valueObj = res.values[0];
            this.setState({ tongjiData:valueObj });
          }
      });
    }
    getServerNoticeListData = (organId,currentIndex)=>{
      $.post(`${urlPrefix}/android/infoPublish/query.action`,
        {
          organId:organId,
          currentIndex:currentIndex
        },(data,state)=>{
          //这里显示从服务器返回的数据
          let res = decodeURIComponent(data);
          try{
             res = JSON.parse(res);
          }catch(e){
          }
          console.log("矫正系统的获取通知公告的返回---：",res,state);
          if(res.respCode != "0"){
            this.state.isMobile ?
              Toast.info(res.respMsg, 2, null, false):
              notification.error({message: '矫正系统获取通知列表失败，'+res.respMsg});
          }else{
            let values = this.parseServerListData(res.values);
            this.setState({
              noticeListData:values || [],
            });
          }
      });
    }
    parseServerListData = (values)=>{
      for(let i=0;i<values.length;i++){
        values[i]['key'] = values[i].id;
      }
      return values;
    }

    getContentElements(){
      if(this.state.menuTab==0){ // 通知公告
        if(this.state.redressOrganId && !this.state.noticeListData){
          this.getServerNoticeListData(this.state.redressOrganId,1);
        }
        return (<NoticeComp noticeListData={this.state.noticeListData}/>);
      }else if(this.state.menuTab==1){ //统计分析
        if(this.state.redressOrganId && !this.state.tongjiData){
          this.getServerAnalysisData(this.state.redressOrganId,1);
        }
        return (<StatisticalAnalysisComp tongjiData={this.state.tongjiData} />);
      }
      return null;
    }
    getMobileElements(sidebarMobile){
      let headerName = this.state.menuTab==0 ? "通知公告" : "统计分析";
        const drawerProps = {
          open: this.state.open,
          position: this.state.position,
          onOpenChange: this.onOpenChange,
        };
        let content = this.getContentElements();
        return (
          <div className='notificationPage_drawer'>
            <Drawer
              style={{ minHeight: document.documentElement.clientHeight - 200 }}
              touch={true} sidebarStyle={{height:'100%',background:'#fff',overflow:'hidden'}}
              contentStyle={{ color: '#A6A6A6'}} sidebar={sidebarMobile}
              {...drawerProps}
            >
              <NavBar className="mobile_navbar_custom"
              iconName = {false} onLeftClick={this.onNavBarLeftClick}
              style={{position:'fixed',height:'60px',zIndex:'13',width:'100%'}}
              leftContent={[ <Icon type="arrow-left" className="back_arrow_icon" key={192384756}/>,
              <span style={{fontSize:'1em'}} key={13212343653}>返回</span>]}
              rightContent={[ <Icon key="6" type="ellipsis" onClick={this.onOpenChange}/>]} >
                <img width="35" height="35" src={signup_logo} style={{marginRight:15}}/>司法E通
              </NavBar>
              <div className="mobileNotificationHeader"> <h5>{headerName}</h5> </div>
              {content}
            </Drawer>
          </div>
        );
      }
      getPCElements(sidebar){
        let content = this.getContentElements();
        let headerName = this.state.menuTab==0 ? "通知公告" : "统计分析";
        return (
          <div>
              <Layout style={{ height: '100vh' }}>
                 <Header className="header custom_ant_header"
                 style={{position:'fixed',width:'100%',zIndex:'13'}}>
                   <div className="custom_ant_header_logo"
                   onClick={this.onClickBackToModules} style={{padding:'0px'}}>
                     <span className="logo_icon"><img width="40" height="40" src={signup_logo}/></span>
                     <div className="logo_title">
                       <p>@{this.state.loginUserName}</p><p>司法E通</p>
                       </div>
                   </div>
                   <div className="notificationHeader"> <h5>{headerName}</h5> </div>
                   <div className="" style={{position:'absolute',right:'32px',top:'0'}}><LogOutComp className="" addGoBackBtn/></div>
                 </Header>
                 <Layout style={{marginTop:'64px',height: '100%'}}>
                   {sidebar}
                   <Layout style={{ padding: '0' }}>
                     <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280,overflow: 'initial' }}>
                       {content}
                     </Content>
                   </Layout>
                 </Layout>
              </Layout>
          </div>
        );
    }
    render() {
      let sidebarMenuMarTop = this.state.isMobile ? '60px' : '0';
      const sidebar = (
        <Sider width={240} className="custom_ant_sidebar"
          style={{ background: '#2071a7',color:'#fff',overflow: 'auto',
          zIndex:'99999', marginTop:sidebarMenuMarTop, height:'100%'}}>
          <Menu
            theme="dark"
            mode="inline"
            style={{ width: 240}}
            selectedKeys={[this.state.current]}
            onClick={this.onSidebarMenuClick}
          >
            <Menu.Item key="1"><Icon type="file" />通知公告</Menu.Item>
            <Menu.Item key="2"><Icon type="file-text" />统计分析</Menu.Item>
          </Menu>
        </Sider>
      );
      let finalEle = this.state.isMobile ? this.getMobileElements(sidebar) : this.getPCElements(sidebar);
      return (<div className="notification_container">
        {finalEle}
      </div>);
    }
}

NotificationPage.defaultProps = {
};

NotificationPage.propTypes = {
};

export default NotificationPage;
