
import $ from 'jquery';
import React from 'react';
import {browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';

// import LogOutComp from './components/log_out_comp.jsx';
import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

import { Drawer, NavBar,Button } from 'antd-mobile';
import { Layout, Menu, Icon} from 'antd';
const { SubMenu } = Menu;
const { Sider } = Layout;

import PersonalTodoList from './office_automation/personalTodoList.jsx'; //待办事项
import NoticeList from './office_automation/noticeList.jsx'; //通知公告
import IncomingList from './office_automation/incomingList.jsx'; //收文管理
import DispatchList from './office_automation/dispatchList.jsx'; //发文管理
import SignReportList from './office_automation/signReport/signReportList.jsx'; //签报管理
import SuperviseList from './office_automation/supervision/superviseList.jsx'; //督办管理
import NewDispatchList from './office_automation/newDispatchList.jsx'; //最新发文

import OaSiderbarComp from './office_automation/officeAutoSiderbar_comp.jsx';//侧边栏

import DocumentSubmission from './office_automation/documentSubmission.jsx';//公文报送
import AdministrativeSystemInfos from './office_automation/administrativeSystemInfos.jsx';//工作督查
// import InternalNoticeComp from './office_automation/internalNotice_comp.jsx'; //对内宣传
// import WorkNoticeComp from './office_automation/workNotice_comp.jsx'; //工作通知

import signup_logo from 'images/signup_logo.png';
// import logOut_icon from 'images/modules_img/logOut_icon.png';

class LoginRecordPage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.state = this.getStateFromStores();
        this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
    }
    getStateFromStores() {
        return {
            tokenunid:'xxxxx', //登录标识id
            open: false,
            current: '待办事项',
            position: 'left',
            loginUserName:'',
        };
    }
    onNavBarLeftClick = (e) => {
        browserHistory.push('/');
    }
    onOpenChange = (...args) => { //drawer open changed call.
      console.log(args);
      this.setState({ open: !this.state.open });
    }
    afterChooseMenuItemCall = (key)=>{
      let drawerOpen = this.state.open;
      this.setState({
        current:key,
        open:!drawerOpen
      });
    }
    onClickBackToModules(){
      browserHistory.push('/modules');
    }
    componentWillMount() {
      var me = UserStore.getCurrentUser() || {};
      this.setState({loginUserName:me.username || ''});
      OAUtils.loginOASystem({}, (res)=>{ //登录OA系统获取认证id。
        console.log("get OA login res:",res);
        this.setState({tokenunid:res.values.tockenunid});
      });
    }
    getContentElements(){
      let content = null;
      let {current,tokenunid} = this.state;
      switch(current){
        case "待办事项":
          content = (<PersonalTodoList title={current} tokenunid={tokenunid}/>);
        break;
        case "通知公告":
          content = (<NoticeList title={current} tokenunid={tokenunid}/>);
        break;
        case "收文管理":
          content = (<IncomingList title={current} tokenunid={tokenunid}/>);
        break;
        case "发文管理":
          content = (<DispatchList title={current} tokenunid={tokenunid}/>);
        break;
        case "签报管理":
          content = (<SignReportList title={current} tokenunid={tokenunid}/>);
        break;
        case "督办管理":
          content = (<SuperviseList title={current} tokenunid={tokenunid}/>);
        break;
        case "最新发文":
          content = (<NewDispatchList title={current} tokenunid={tokenunid}/>);
        break;
        case "公文报送":
          content = (<DocumentSubmission title={current} tokenunid={tokenunid}/>);
        break;
        case "司法行政系统信息查询":
          content = (<AdministrativeSystemInfos title={current} tokenunid={tokenunid}/>);
        break;
        default:
          break;
      }
      return content;
    }
    render() {
      const drawerProps = {
        open: this.state.open,
        position: this.state.position,
        onOpenChange: this.onOpenChange,
      };
      const sidebarMobile = (
        <OaSiderbarComp afterChooseMenuItemCall={(key)=>{this.afterChooseMenuItemCall(key)}} />
      );
      return (
        <div className="Office_Automation_container">
          <div className='office_automation_drawer'>
            <Drawer
              style={{ minHeight: document.documentElement.clientHeight - 60 }}
              touch={true}
              sidebarStyle={{height:'100%',background:'#fff'}}
              contentStyle={{ color: '#A6A6A6'}}
              sidebar={sidebarMobile}
              {...drawerProps} >
              <NavBar className="mobile_navbar_custom"
              style={{position:'fixed',height:'60px',zIndex:'13',width:'100%'}}
              iconName = {false} onLeftClick={this.onNavBarLeftClick}
              leftContent={[
                <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
                <span key={1}>返回</span>
              ]}
              rightContent={[
                <Icon key="6" type="ellipsis" onClick={this.onOpenChange}/>
              ]}>
                <img width="35" height="35" src={signup_logo}/>司法E通
              </NavBar>
              <div style={{marginTop:'60px'}}>
                {this.state.tokenunid ? this.getContentElements() : null}
              </div>
            </Drawer>
          </div>
        </div>
      );
    }
}

LoginRecordPage.defaultProps = {
};

LoginRecordPage.propTypes = {
};

export default LoginRecordPage;
