//电子通讯录页面
import $ from 'jquery';

import React from 'react';
import {browserHistory} from 'react-router/es6';
import OrganizationStore from 'pages/stores/organization_store.jsx';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import * as organizationUtils from './utils/organization_utils.jsx';

import { SearchBar, Drawer, List, NavBar } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Icon, Button, Input } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const Search = Input.Search;
import LogOutComp from './components/log_out_comp.jsx';
import * as addressBookUtils from './utils/addressBook_utils.jsx';
import AddressSidebarMenuComp from './addressbook/addressSidebar_comp.jsx';
import AddressListComp from './addressbook/addressList_comp.jsx';
import AddressListMobileComp from './addressbook/addressList_mobile_comp.jsx';
import AddEditContactDialog from './addressbook/addEditContact_dialog.jsx';
import AddEditContactMobileDialog from './addressbook/addEditContact_mobile_dialog.jsx';
import AddressSearchComp from './addressbook/addressSearch_comp.jsx';
// import List  from 'antd-mobile/lib/list';

import signup_logo from 'images/signup_logo.png';
import avatorIcon_man from 'images/avator_icon/avator_man.png';
import avatorIcon_woman from 'images/avator_icon/avator_woman.png';
import avatorIcon01 from 'images/avator_icon/avator01.jpg';
import avatorIcon02 from 'images/avator_icon/avator02.jpg';
import avatorIcon03 from 'images/avator_icon/avator03.jpg';
import avatorIcon04 from 'images/avator_icon/avator04.jpg';

class AddressBookPage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
        this.onSubmitSearch = this.onSubmitSearch.bind(this);
        this.updateOrganizationData = this.updateOrganizationData.bind(this);
        this.state = this.getStateFromStores();
    }
    getStateFromStores() {

        return {
            open: false,
            position: 'left',
            organizationKey:'',
            addressbookData:[],
            breadcrumbData:['全部'],
            loginUserName:'',
            organizationsData:[],
            organizationsFlatData:[],
            organizationsFlatDataMap:{},
            isShowEditDialog:false,
            contactInfo:{},
            isMobile: Utils.isMobile()
        };
    }
    onNavBarLeftClick = (e) => {  //navbar left click.
      browserHistory.push('/');
    }
    onOpenChange = (...args) => { //drawer open changed call.
      console.log(args);
      this.setState({ open: !this.state.open });
    }

    componentWillMount() {
      let _this = this;
      var me = UserStore.getCurrentUser() || {};
      console.log("me info:",me);
      this.setState({loginUserName:me.username||''});
      // this.getServerOrganizationsData();
      organizationUtils.getServerOrganizationsData();
      OrganizationStore.addOrgaChangeListener(this.updateOrganizationData);
      this.getAddressBookCnt(this.state.organizationKey);
    }
    componentWillUnmount(){
      OrganizationStore.removeOrgaChangeListener(this.updateOrganizationData);
    }
    updateOrganizationData(){
      this.setState({
        "organizationsData":OrganizationStore.getOrgaData()||[],
        "organizationsFlatData":OrganizationStore.getOrgaFlatData()||[],
        "organizationsFlatDataMap":OrganizationStore.getOrgaFlatMap()||{}
      });
    }
    getAddressBookCnt(organizations){
      let params = {};
      if(typeof organizations == "string"){ //表示传入的是组织结构名。
        params = {"organization":organizations};
        this.setState({organizationKey:organizations});
      }else if(typeof organizations == "object"){ //表示传入的搜索的对象参数。
        params = organizations;
      }
      myWebClient.getServerAddressBook(params,
        (data,res)=>{
          let objArr = JSON.parse(res.text);
          console.log("request server addressbook error res text:",objArr);
          objArr = addressBookUtils.parseContactsData(objArr);
          this.setState({"addressbookData":objArr});
        },(e, err, res)=>{
          console.log("request server addressbook error info:",err);
        });
    }

    setBreadcrumbData(dataArr){
      this.setState({"breadcrumbData":dataArr});
    }
    onClickBackToModules(){
      browserHistory.push('/modules');
    }
    onSubmitSearch(value){
      console.log("onSubmitSearch:",value);
      let params = {
        "organization":this.state.organizationKey
      }
      if(value){
        params['filter'] = value;
      }
      this.getAddressBookCnt(params);
    }
    showAddEditDialog = (data)=>{ //显示新增编辑弹窗。
      console.log("showAddressBook--AddEditDialog--:");
      let info = data || {};
      this.setState({contactInfo:info, isShowEditDialog:true});
    }
    closeAddEditDialog = ()=> {   // 隐藏新增Or编辑的弹窗。
      this.setState({ isShowEditDialog: false });
    }
    afterAddEditContactsCall = ()=>{ //新增编辑成功后更新列表。
      this.onSubmitSearch();
    }
    afterDeleteContactsCall = ()=>{
      this.onSubmitSearch();
    }

    getMobileElements(sidebar){
      const drawerProps = {
        open: this.state.open,
        position: this.state.position,
        onOpenChange: this.onOpenChange,
      };
      let content = this.getListContentElements();
      return (<div>
        <Drawer
          className="address_book_drawer"
          style={{ minHeight: document.documentElement.clientHeight - 200 }}
          touch={true}
          sidebarStyle={{height:'100%',background:'#fff'}}
          contentStyle={{ color: '#A6A6A6'}}
          sidebar={sidebar}
          {...drawerProps} >
          <NavBar
            style={{position:'fixed',height:'60px',zIndex:'13',width:'100%'}}
            className="mobile_navbar_custom"
            iconName = {false}
            leftContent={[ <Icon type="arrow-left" className="back_arrow_icon" key={192384756}/>,<span style={{fontSize:'1em'}} key={13212343653}>返回</span>]}
            onLeftClick={this.onNavBarLeftClick}
            rightContent={[ <Icon key="1" type="ellipsis" style={{fontSize:'0.4rem'}} onClick={this.onOpenChange}/>]} >
            <img width="35" height="35" src={signup_logo}/>司法E通
          </NavBar>
          <div style={{marginTop:'60px'}}>
            <SearchBar
              placeholder="用户名/邮件/电话"
              onSubmit={this.onSubmitSearch}
              onClear={value => console.log(value, 'onClear')}
              onFocus={() => console.log('onFocus')}
              onCancel={() => console.log('onCancel')}
              onChange={() => {}}
            />
            {content}
          </div>
        </Drawer></div>);
    }

    getPCElements(sidebar){
      let content = this.getListContentElements();
      let breadcrumbEles = this.getBreadcrumbItem();
      return ( <Layout style={{ height: '100vh' }}>
                <Header className="header custom_ant_header addressbook_header" style={{position:'fixed',width:'100%',zIndex:'13'}}>
                      <div className="custom_ant_header_logo addressbook_logo" onClick={this.onClickBackToModules}>
                        <span className="logo_icon"><img width="40" height="40" src={signup_logo}/></span>
                        <div className="logo_title">
                          <p>@{this.state.loginUserName}</p><p>司法E通</p>
                          </div>
                      </div>
                      <Breadcrumb className="bread_content" style={{ margin: '0 10px',float:'left' }}>
                        <Breadcrumb.Item className="bread_item">电子通讯录</Breadcrumb.Item>
                        {breadcrumbEles}
                      </Breadcrumb>
                      <div className="" style={{position:'absolute',right:'32px',top:'0'}}>
                        <LogOutComp className="logout_addressbook" addGoBackBtn/>
                      </div>
                </Header>
                <Layout style={{marginTop:'64px'}} className={'addressbook_menu_container'}>
                  {sidebar}
                  <Layout style={{ padding: '0' }}>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280,overflow: 'initial' }}>
                      <AddressSearchComp
                        onSubmitSearchCall={(val)=>this.onSubmitSearch(val)}
                      />
                      {content}
                    </Content>
                  </Layout>
                </Layout>
              </Layout>);
    }
    getBreadcrumbItem(){
      let {breadcrumbData} = this.state;
      let bread_items = breadcrumbData.map((val,index)=>{
          return <Breadcrumb.Item className="bread_item" key={index}>{val}</Breadcrumb.Item>
        });
      return bread_items;
    }
    getListContentElements(){
      let { addressbookData } = this.state;
      return this.state.isMobile?
        (<AddressListMobileComp
          addressListData={addressbookData}
          showAddEditDialog={this.showAddEditDialog}
          afterDeleteContactsCall={this.afterDeleteContactsCall}
        />):
        (<AddressListComp
          addressListData={addressbookData}
          showAddEditDialog={this.showAddEditDialog}
          afterDeleteContactsCall={this.afterDeleteContactsCall}
        />);
    }

    render() {
      let sidebarMenuMarTop = this.state.isMobile ? '60px' : '0';
      let {isShowEditDialog,contactInfo} = this.state;
      const sidebar = (
        <Sider width={240}
            className="custom_ant_sidebar addressSidebar"
            style={{ background: '#2071a7',color:'#fff',overflow: 'auto',marginTop:sidebarMenuMarTop,zIndex:'9999' }}>
            <AddressSidebarMenuComp
              organizationsData={this.state.organizationsData}
              organizationsFlatData={this.state.organizationsFlatData}
              organizationsFlatDataMap={this.state.organizationsFlatDataMap}
              getAddressBookCnt={(key)=>{this.getAddressBookCnt(key)}}
              setBreadcrumbData={(arr)=>{this.setBreadcrumbData(arr)}} />
        </Sider>
      );
      let finalEle = this.state.isMobile ? this.getMobileElements(sidebar) : this.getPCElements(sidebar);
      let editDialog = this.state.isMobile ?
                            (<AddEditContactMobileDialog
                                visible={isShowEditDialog}
                                contactInfo={contactInfo}
                                closeAddEditDialog={this.closeAddEditDialog}
                                afterAddEditContactsCall={this.afterAddEditContactsCall}
                                organizationsData={this.state.organizationsData}
                                organizationsFlatData={this.state.organizationsFlatData}
                                organizationsFlatDataMap={this.state.organizationsFlatDataMap}
                              />) :
                            (<AddEditContactDialog
                                visible={isShowEditDialog}
                                contactInfo={contactInfo}
                                closeAddEditDialog={this.closeAddEditDialog}
                                afterAddEditContactsCall={this.afterAddEditContactsCall}
                                organizationsData={this.state.organizationsData}
                                organizationsFlatData={this.state.organizationsFlatData}
                                organizationsFlatDataMap={this.state.organizationsFlatDataMap}
                              ></AddEditContactDialog>);
      return (<div className="address_book_container">
        {finalEle}
        {editDialog}
      </div>);
    }
}

AddressBookPage.defaultProps = {
};

AddressBookPage.propTypes = {
};

export default AddressBookPage;
