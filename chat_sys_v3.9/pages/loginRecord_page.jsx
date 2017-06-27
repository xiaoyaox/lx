
import $ from 'jquery';
import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import TeamStore from 'stores/team_store.jsx';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';
import LogOutComp from './components/log_out_comp.jsx'
import myWebClient from 'client/my_web_client.jsx';

import UserLoginRecordComp from './login_record/userLoginRecord_comp.jsx';
import AdminLoginRecordComp from './login_record/adminLoginRecord_comp.jsx';
import { Drawer, List, NavBar,Button } from 'antd-mobile';
import { Layout, Menu, Icon, notification ,Calendar} from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider ,Footer} = Layout;
// import List  from 'antd-mobile/lib/list';

import signup_logo from 'images/signup_logo.png';
import logOut_icon from 'images/modules_img/logOut_icon.png';
const Item = List.Item;
const Brief = Item.Brief;

class LoginRecordPage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.state = this.getStateFromStores();
        this.getMobileElements = this.getMobileElements.bind(this);
        this.getPCElements = this.getPCElements.bind(this);

        this.getBody = this.getBody.bind(this);
    }
    getStateFromStores() {
        const teamMembers = TeamStore.getMyTeamMembers();
        const currentTeamId = TeamStore.getCurrentId();

        return {
            teams: TeamStore.getAll(),
            teamListings: TeamStore.getTeamListings(),
            teamMembers,
            currentTeamId,
            open: false,
            position: 'left',
            loginUserName:'',
            isAdmin:UserStore.getIsadmin() || false,
            isMobile: Utils.isMobile()
        };
    }

    onNavBarLeftClick () {
      browserHistory.push('/');
    }

    onClickBackToModules(){
      browserHistory.push('/modules');
    }

    componentWillMount() {
      var me = UserStore.getCurrentUser() || {};
      this.setState({loginUserName:me.username || ''});
    }

    onOpenChange = (...args) => {
      console.log(args);
      this.setState({ open: !this.state.open });
    }
    getMobileElements(sidebarMobile){
      const drawerProps = {
        open: this.state.open,
        position: this.state.position,
        onOpenChange: this.onOpenChange,
      };
      let content = <div className="loginRecordMobile">{this.getBody()}</div>;
      return (<div className='office_automation_drawer'>
        <Drawer
          style={{ minHeight: document.documentElement.clientHeight - 200 }}
          touch={true} sidebarStyle={{height:'100%',background:'#fff',overflow:'hidden'}}
          contentStyle={{ color: '#A6A6A6'}} sidebar={sidebarMobile}
          {...drawerProps} >
          <NavBar className="mobile_navbar_custom"
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%'}}
          leftContent={[ <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
        <span style={{fontSize:'1em'}} key={3}>返回</span>]}
          rightContent={[ <Icon key="6" type="ellipsis" onClick={this.onOpenChange}/>]} >
            <img width="35" height="35" src={signup_logo}/>司法E通
          </NavBar>
          {content}
        </Drawer></div>);

    }

    getBody(){
      return this.state.isAdmin ? (<AdminLoginRecordComp />) : (<UserLoginRecordComp />);
    }

    getPCElements(sidebar){
            let content = this.getBody();
          return (<div>
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
                             <div className="sysHeader"> <h5>登录签到</h5> </div>
                             <div className="" style={{position:'absolute',right:'32px',top:'0'}}><LogOutComp className="" addGoBackBtn/></div>
                           </Header>
                           <Layout style={{marginTop:'64px'}}>
                             {sidebar}
                             <Layout style={{ padding: '0' }}>
                               <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280,overflow: 'initial' }}>
                                 {content}
                               </Content>
                             </Layout>
                           </Layout>
                        </Layout>)
                  </div>);
    }

  render() {
    let sidebarMenuMarTop = this.state.isMobile ? '60px' : '0';
      const sidebarMobile = (
      <Sider width={240} className="custom_ant_sidebar addressSidebar"
        style={{ background: '#2071a7',color:'#fff', zIndex:'12', overflow: 'hidden' ,
        height:'100%',marginTop:sidebarMenuMarTop}}>
        <Menu
          theme="dark"
          mode="inline"
          style={{ width: 246}}
          selectedKeys={[this.state.current]}
          onClick={this.handleClick}
        >
        <Menu.Item key="1" style={{fontSize:'18px'}}><Icon type="file" />登录签到</Menu.Item>
        </Menu>
      </Sider>
    )
    const sidebar = (
      <Sider width={240} className="custom_ant_sidebar addressSidebar"
        style={{ background: '#2071a7',color:'#fff',overflow: 'hidden',position:'fixed',zIndex:'12',height:'100%'}}>
        <Menu
          theme="dark"
          mode="inline"
          style={{ width: 240}}
        >
            <Menu.Item key="1"><Icon type="calendar" />登录签到</Menu.Item>
        </Menu>
      </Sider>
    )
    let finalEle = this.state.isMobile ? this.getMobileElements(sidebarMobile) : this.getPCElements(sidebar);
    return (<div className="login_record_container">
      {finalEle}
    </div>);

  }
}

LoginRecordPage.defaultProps = {
};

LoginRecordPage.propTypes = {
};

export default LoginRecordPage;
