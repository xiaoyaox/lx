import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { SearchBar, List,Button } from 'antd-mobile';
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;

export default class DocumentSidebar extends React.Component {
  static get propTypes() {
      return {
        departmentData: React.PropTypes.array
      };
  }
  constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
      this.state = {
        current: '-1',
        openKeys: [],
        isMobile: Utils.isMobile()
      };
  }
  componentDidMount() {
    if(this.props.departmentData && this.props.departmentData.length ){
      let openKey = this.props.departmentData[0].resourceId || '';
      console.log(openKey);
      this.setState({openKeys: [openKey]});
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.departmentData !== nextProps.departmentData && nextProps.departmentData.length ){
      let openKey = nextProps.departmentData[0].resourceId || '';
      // this.updateAddressBookList(openKey);
      // this.updateAddressBookBreadcrumb([openKey]);
      // console.log(openKey);
      this.setState({openKeys: [this.props.currentFileType]});
    }
  }
  // menu item click handler
   handleClick = (e) => {
    this.setState({ current: e.key });
    // console.log(e.item.props.children);
    // console.log("e.keyPath",e.keyPath);
    if (e.item.props.children) {
      const {currentFileType} = this.props;
      const currentDepartment = e.item.props.children;
      this.props.searchFormPC && this.props.searchFormPC.setFieldsValue({
        userName: '', gender: ''
      });
      let currentFileSubType = e.keyPath[1];
      this.props.setCurrentFileSubType(currentFileSubType);
      this.props.setCurrentDepartment(currentDepartment);
      const searchParam = {
        fileInfoType: currentFileType,
        fileInfoSubType: currentFileSubType,
        department: currentDepartment
      }
      // console.log('menu item Clicked, searchParam: ', searchParam);
      this.props.handleSearch(searchParam);
    }
  }

  onMenuOpenChange = (openKeys) => {
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    this.setState({ openKeys: openKeys });
    this.setState({ current: '-1' });
    if (latestOpenKey) {
      this.updateDocumentList(latestOpenKey);
    }

  }

  updateDocumentList(key){
    if(!key || key== this.props.currentFileType){
      key = '机关人员';
    }
    let department = [];
    this.props.departmentData.map((parent) => {
      if(parent.resourceName == key){
        parent.sub.map((item) => {
          department.push(item.resourceName);
        });
      }
    });
    const param = {
      fileInfoType: this.props.currentFileType,
      fileInfoSubType: key,
      department:department.join(',')
    }
    // console.log(param);
    this.props.setCurrentFileSubType(key);
    this.props.setCurrentDepartment('');
    this.props.handleSearch(param);
  }

  getMenuItemList(sidebarConfig){
    let ele = [];
    let _this = this;
    $.each(sidebarConfig, (index, obj)=>{
      // console.log("sidebarConfig obj:",obj);
      if( !obj.sub || obj.sub.length <= 0){ //已经是子节点了。
        ele.push(<Menu.Item key={obj.resourceId}>{obj.resourceName}</Menu.Item>);
      }else{ //表示还有孩子节点存在。
        let childConfig = obj.sub;
        let tempEle = _this.getMenuItemList(childConfig);
        ele.push((<SubMenu key={obj.resourceId} title={<span>{obj.resourceName}</span>}>{tempEle}</SubMenu>)); //递归调用
      }
    });
    return ele;
  }
  render() {
    const { departmentData, currentFileType } = this.props;
    // (departmentData[0] && departmentData[0].id!='-1') && departmentData.unshift({
    //   id:'-1',
    //   name:'全部',
    //   parentId:'',
    //   organizationLevel:1,
    //   privilegeLevel:'1',
    //   sub:null
    //
    // });
    const sidebarMenuList =  this.getMenuItemList(departmentData);
    // console.log(this.state.openKeys);
    return (
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={[currentFileType]}
            openKeys={this.state.openKeys}
            selectedKeys={[this.state.current]}
            style={{ width: 240 }}
            onOpenChange={this.onMenuOpenChange}
            onClick={this.handleClick} >
            <SubMenu key={currentFileType} title={<span><Icon type="mail" /><span>人事档案</span></span>}>
              {sidebarMenuList}
            </SubMenu>
          </Menu>

    );
  }
}
