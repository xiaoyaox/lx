import $ from 'jquery';
import ReactDOM from 'react-dom';

import React from 'react';
import {Link} from 'react-router/es6';
// import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import TeamStore from 'stores/team_store.jsx';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';
import client from 'client/web_client.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { SearchBar, Drawer, List, NavBar,Button } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Icon, Affix as AffixPc, Input } from 'antd';
const { SubMenu } = Menu;


export default class AddressSidebarMenuComp extends React.Component {
  static get propTypes() {
      return {
        organizationsData:React.PropTypes.array,
        organizationsFlatData:React.PropTypes.array,
        organizationsFlatDataMap:React.PropTypes.object,
        onClickMenuItem: React.PropTypes.func,
        getAddressBookCnt: React.PropTypes.func.isRequired,
        setBreadcrumbData: React.PropTypes.func.isRequired
      };
  }
  constructor(props) {
      super(props);
      this.state = {
        current: '-1',
        openKeys: [],
        isMobile: Utils.isMobile()
      };
  }
  componentWillMount() {
    if(this.props.organizationsData && (this.props.organizationsData[0])){
      let openKey = this.props.organizationsData[0].id || '';
      this.updateAddressBookList(openKey);
      this.updateAddressBookBreadcrumb([openKey]);
      this.setState({"openKeys":[openKey]});
    }

  }

  componentWillReceiveProps(nextProps){
  }
  // menu item click handler
   handleClick = (e) => {
    console.log('Clicked: ', e);
    this.setState({ current: e.key });
    e.key && this.updateAddressBookList(e.key);
    let tempArr = e.keyPath;
    this.updateAddressBookBreadcrumb(tempArr.reverse());
    this.props.onClickMenuItem();
  }
  onMenuOpenChange = (openKeys) => {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));
    latestOpenKey && this.updateAddressBookList(latestOpenKey);
    if(latestOpenKey){
      let breadcrumbKeys = [], parentid = latestOpenKey;
      while(parentid && parentid != "-1" && parentid!= -1){
        breadcrumbKeys.push(parentid);
        parentid = this.props.organizationsFlatDataMap[parentid].parentId;
      }
      this.updateAddressBookBreadcrumb(breadcrumbKeys.reverse());
    }
    this.setState({ openKeys: openKeys });
  }
  updateAddressBookBreadcrumb(openKeys){
    if(this.state.isMobile){
      return;
    }
    let openMenuNameArr = [];
    let {organizationsFlatDataMap} = this.props;
    organizationsFlatDataMap['-1'] = {
      id:'-1',
      name:'全部',
      parentId:'',
      organizationLevel:1,
      privilegeLevel:'1',
      subOrganization:null
    }
    $.each(openKeys,(index,val)=>{
      openMenuNameArr.push(organizationsFlatDataMap[val]["name"]);
    });
    this.props.setBreadcrumbData(openMenuNameArr);
  }

  updateAddressBookList(organizationKey){
    if(!organizationKey || organizationKey=='-1'){
      organizationKey = '';
    }
    this.props.getAddressBookCnt(organizationKey);
  }

  getMenuItemList(sidebarConfig){
    let ele = [];
    let _this = this;
    $.each(sidebarConfig, (index, obj)=>{
      // console.log("sidebarConfig obj:",obj);
      if(!obj.subOrganization || obj.subOrganization.length<=0){ //已经是子节点了。
        ele.push((<Menu.Item key={obj.id}>{obj.name}</Menu.Item>));
      }else{ //表示还有孩子节点存在。
        let childConfig = obj.subOrganization;
        let tempEle = _this.getMenuItemList(childConfig);
        ele.push((<SubMenu key={obj.id} title={<span>{obj.name}</span>}>{tempEle}</SubMenu>)); //递归调用
      }
    });
    return ele;
  }
  render() {
    const { organizationsData } = this.props;
    (organizationsData[0] && organizationsData[0].id!='-1') && organizationsData.unshift({
      id:'-1',
      name:'全部',
      parentId:'',
      organizationLevel:1,
      privilegeLevel:'1',
      subOrganization:null

    });
    const sidebarMenuList =  this.getMenuItemList(organizationsData);
    return (
          <Menu
            theme="dark"
            mode="inline"
            openKeys={this.state.openKeys}
            selectedKeys={[this.state.current]}
            style={{ width: 240 }}
            onOpenChange={this.onMenuOpenChange}
            onClick={this.handleClick} >
            {sidebarMenuList}
          </Menu>

    );
  }
}
