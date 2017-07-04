// 档案管理的页面
import $ from 'jquery';
import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';
import Client from 'client/web_client.jsx';
import MyWebClient from 'client/my_web_client.jsx';
import LogOutComp from './components/log_out_comp.jsx';

import moment from 'moment';
import { Drawer, List, NavBar, Popup, Modal as ModalAm } from 'antd-mobile';
const ModalAmAlert = ModalAm.alert;
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Table, Modal, notification } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const confirm = Modal.confirm;

import signup_logo from 'images/signup_logo.png';

import WrappedSearchFormPC from './document/search_form_pc.jsx';
import WrappedSearchFormMobile from './document/search_form_mobile.jsx';
import DocumentEditModalPC from './document/edit_modal_pc.jsx';
import DocumentEditLawyerModalPC from './document/edit_lawyer_modal_pc.jsx';
import DocumentSidebar from './document/document_sidebar.jsx';
import DocumentListPC from './document/documentList_pc_comp.jsx';

class DocumentPage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCancelModal = this.handleCancelModal.bind(this);
        this.showDeleteConfirm =this.showDeleteConfirm.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'] ? permissionData['sys_config'].indexOf('action') != -1 : false;
      return {
          open: false,
          position: 'left',
          isMobile: Utils.isMobile(),
          visibleEditModel: false,
          documentsData: [],
          loginUserName:'',
          memberInfo: {},
          searchParam: {},
          currentFileType: '人事档案',
          currentFileSubType: '机关人员',
          currentDepartment: '',
          departmentTypes: [],
          hasOperaPermission:hasOperaPermission, //是否有操作权限。
          departmentData: []
      };
  }
  onOpenChange = (...args) => {
    // console.log(args);
    this.setState({ open: !this.state.open });
  }
  onNavBarLeftClick = (e) => {  //navbar left click.
    browserHistory.push('/');
  }
  onClickBackToModules(){
    browserHistory.push('/modules');
  }
  componentWillMount() {
    let _this = this;
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username || ''});
    this.getFileDepartment(me.organizations,(firstDepart,departmentData)=>{
      this.setState({
        currentFileSubType:firstDepart
      });
      let params = {
        fileInfoType:this.state.currentFileType,
        fileInfoSubType:firstDepart
      }
      let department = [];
      departmentData.map((parent) => {
        if(parent.resourceName == firstDepart){
          parent.sub.map((item) => {
            department.push(item.resourceName);
          });
        }
      });
      department.length >0 ? params.department = department.join(',') : null;
      this.handleSearch(params);
    });
  }
  componentWillUnmount() {
  }
  handleSearch(param) {
    let _param = {};
    if (param) {
      _param = param;
      this.setState({searchParam: param});
    } else {
      _param = this.state.searchParam;
    }
    const {currentFileType, currentFileSubType, currentDepartment} = this.state;
    if (!param || !param.fileInfoType) {
      _param.fileInfoType = currentFileType;
      if(currentFileSubType) _param.fileInfoSubType = currentFileSubType;
      if(currentDepartment){
        _param.department = currentDepartment;
      }else{
        let department = [];
        this.state.departmentData.map((parent) => {
          if(parent.resourceName == currentFileSubType){
            parent.sub.map((item) => {
              department.push(item.resourceName);
            });
          }
        });
        department.length >0 ? _param.department = department.join(',') : null;
      }
    }
    MyWebClient.getSearchFileInfo(_param,
      (data, res) => {
        if (res && res.ok) {
          let documentsData = JSON.parse(res.text);
          //  console.log("documentsData---:",documentsData);
          // console.log(documentsData);
          this.setState({ documentsData });
          if (!this.state.departmentTypes.length) {
            const departArr = [];
            for (var i = 0; i < documentsData.length; i++) {
              if (departArr.indexOf(documentsData[i].department) === -1) {
                departArr.push(documentsData[i].department);
              }
            }
           //  console.log(departArr);
            this.setState({ departmentTypes: departArr });
          }
        }
      },
      (e, err, res) => {
        console.log('get error:', res ? res.text : '');
      }
    );
  }
  convertSiderData(rows) { //把平行结构的带权限的部门数据转换成分层结构形式。
    var parnts = [], nodes = [];
    function getChild(row) {
      for (var j = 0; j < nodes.length; j++) {
        if (nodes[j].resourceName == row.parntName) {
          nodes[j].sub.push(row);
        }
      }
    }
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      row.resourceId = row.id, row.resourceName = row.name;
      if (parnts.indexOf(row.parntName) > -1) {
        getChild(row);
      } else {
        parnts.push(row.parntName);
        nodes.push( { resourceId: row.parntName, resourceName: row.parntName, sub: []});
        getChild(row);
      }
    }
    return nodes;
  }
  getFileDepartment(organizations,callback) { //权限部门数据
    let _this = this;
    MyWebClient.getFileDepartment(organizations,
      (data, res) => {
        if (res && res.ok) {
         //  console.log(res.text);
          const result = JSON.parse(res.text);
          const resource = this.convertSiderData(result);
          // console.log("departmentData-档案管理-权限部门数据-:",resource);
          this.setState({departmentData: resource});
          callback && callback(resource[0]['resourceName'],resource);
        }
      },
      (e, err, res) => {
        console.log('get error:', res ? res.text : '');
      }
    );
  }
  handleShowModal(record) {
    const {documentsData} = this.state;
    let docObj = {};
    for (let i = 0; i < documentsData.length; i++) {
      if (documentsData[i].id == record.key) {
        record = documentsData[i], docObj = documentsData[i];
      }
    }
    // console.log("memberInfo -- record:",record);
    this.setState({ memberInfo: record });
    this.setState({ visibleEditModel: true });
    Object.keys(docObj).forEach((key) => {
      // if (key == 'fileInfoType' || key == 'fileInfoSubType' || key == 'familyMember' || key == 'department') {
      //   delete docObj[key]
      // }
      if (key == 'birthDay' || key == 'joinPartyTime' || key == 'joinWorkerTime'
        || key == 'reportingTime' || key == 'approvalTime' || key == 'appointAndRemoveTime' ) {
        docObj[key] = docObj[key] ? moment(docObj[key], 'YYYY-MM-DD') : null;
      }
    });
  }
  handleCancelModal() {
    this.setState({ visibleEditModel: false });
  }
  showDeleteConfirm(doc, callback) {
    let _this = this;
    if (this.state.isMobile) {
      ModalAmAlert('删除', '确认删除吗 ?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确认', onPress: () => console.log('ok'), style: { fontWeight: 'bold' } },
      ]);
    } else {
      confirm({
        title: '确认删除吗 ?',
        content: '',
        onOk() {
          if (doc.key) {
            _this.handleDeleteDocument(doc.key.toUpperCase(), callback);
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }
  handleDeleteDocument(id, callback) {
    let _this = this;
    MyWebClient.deleteFileInfo(id,
      (data, res) => {
        if (res && res.ok) {
          if (res.text === 'true') {
            _this.openNotification('success', '删除档案成功');
            _this.handleSearch();
            if (callback && typeof callback == 'function') {
              callback(true);
            }
          } else {
            _this.openNotification('error', '删除档案失败');
          }
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '删除档案失败');
      }
    )
  }
  openNotification(type, message) {
    notification.config({
      top: 68,
      duration: 3
    });
    notification[type]({
      message: message
    });
  }
  setCurrentFileSubType(currentFileSubType) {
    this.setState({currentFileSubType});
  }
  setCurrentDepartment(currentDepartment, callback) {
    this.setState({currentDepartment});
  }
  getMobileElements(sidebar){
    const drawerProps = {
      open: this.state.open,
      position: this.state.position,
      onOpenChange: this.onOpenChange,
    };
    let content = this.getListContentElements();
    return (
      <div>
        <Drawer
          className="address_book_drawer"
          style={{ minHeight: document.documentElement.clientHeight - 200 }}
          touch={true}
          sidebarStyle={{height:'100%',background:'#2071a7'}}
          contentStyle={{ color: '#A6A6A6'}}
          sidebar={sidebar}
          {...drawerProps} >
            <NavBar
              style={{position:'fixed',height:'60px',zIndex:'13',width:'100%'}}
              className="mobile_navbar_custom"
              iconName = {false}
              leftContent={[ <Icon type="arrow-left" className="back_arrow_icon" key={192384756}/>,<span style={{fontSize:'1em'}} key={13212343653}>返回</span>]}
              onLeftClick={this.onNavBarLeftClick}
              rightContent={[ <Icon key="1" type="ellipsis" onClick={this.onOpenChange}/>]} >
              <img width="35" height="35" src={signup_logo}/>司法E通
            </NavBar>
            <div style={{marginTop:'60px'}}>{content}</div>
          </Drawer>
        </div>
      );
  }
  getPCElements(sidebar){
    let content = this.getListContentElements();
    return ( <Layout style={{ height: '100vh' }}>
              <Header className="header custom_ant_header addressbook_header" style={{position:'fixed',width:'100%',zIndex:'13'}}>
                <div className="custom_ant_header_logo addressbook_logo" onClick={this.onClickBackToModules}>
                  <span className="logo_icon"><img width="40" height="40" src={signup_logo}/></span>
                  <div className="logo_title">
                    <p>@{this.state.loginUserName}</p><p>司法E通</p>
                    </div>
                </div>
                <Breadcrumb className="bread_content" style={{ margin: '0 10px',float:'left' }}>
                  <Breadcrumb.Item className="bread_item">档案管理</Breadcrumb.Item>
                  <Breadcrumb.Item className="bread_item">{this.state.currentFileSubType}</Breadcrumb.Item>
                  <Breadcrumb.Item className="bread_item">{this.state.currentDepartment}</Breadcrumb.Item>
                </Breadcrumb>
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
        </Layout>);
  }
  getSearchForm() {
    const {currentFileType, currentFileSubType, departmentData} = this.state;
    return this.state.isMobile ?
            (
              <WrappedSearchFormMobile
                departmentData={departmentData}
                currentFileType={currentFileType}
                currentFileSubType={currentFileSubType}
                handleSearch={this.handleSearch} />
            ) :(
              <WrappedSearchFormPC
                ref="searchFormPC"
                departmentData={departmentData}
                currentFileType={currentFileType}
                currentFileSubType={currentFileSubType}
                handleSearch={this.handleSearch}
                openNotification={this.openNotification}/>
          );
  }
  getSearchResultTable() {
    const {documentsData,departmentData, currentFileType, currentFileSubType, departmentTypes, currentDepartment} = this.state;
    // console.log("documentsData---:",documentsData);
    for (let i = 0; i < documentsData.length; i++) {
      documentsData[i]['key'] = documentsData[i].id;
    }
    const data = documentsData;
    let docSearchPCList = (
      <DocumentListPC data={data}
        currentFileType={currentFileType}
        currentFileSubType={currentFileSubType}
        departmentTypes={departmentTypes}
        currentDepartment={currentDepartment}
        departmentData={departmentData}
        showDeleteConfirm={this.showDeleteConfirm}
        handleShowModal={this.handleShowModal}
        handleSearch={this.handleSearch}></DocumentListPC>
    )

    let docSearchMobileList = (//构造手机端的列表视图
      <div className="am-doc-list doc-table">
        {(!data || data.length<=0) ? (<div style={{textAlign:'center',color:'gray'}}>暂无数据</div>) : null}
        <List style={{ margin: '0.1rem 0', backgroundColor: 'white' }}>
          {data.map((item, index) => (
            <List.Item key={index}
              extra={this.state.hasOperaPermission?
                (<div>
                  <a href="javascript:;" className="am-link" onClick={this.handleShowModal.bind(this, item)}>
                    <Icon type="edit" /> 编辑
                  </a><br/>
                  <a href="javascript:;" className="am-link" onClick={this.showDeleteConfirm}><Icon type="delete" /> 删除</a>
                </div>):(<span>没有权限</span>)}
              multipleLine
            >
              <div>姓名：{item.userName}</div>
              <List.Item.Brief>
                性别: {item.gender}, 地址: {this.state.currentFileSubType=="律师" ? item.lawOfficeAddress : item.createParty}
              </List.Item.Brief>
            </List.Item>
          ))}
        </List>
      </div>
    )

    return this.state.isMobile ? docSearchMobileList : docSearchPCList;
  }
  getListContentElements(){
    let searchForm = this.getSearchForm();
    let docSearchList = this.getSearchResultTable();
    let content = (<div className="addressbook_list">
          {searchForm}
          {docSearchList}
        </div>);
    return content;
  }

  render() {
    const {visibleEditModel, memberInfo, currentFileType, currentFileSubType, departmentTypes, departmentData, currentDepartment} = this.state;
    // console.log('departmentData--:',departmentData);
    let sidebarMenuMarTop = this.state.isMobile ? '60px' : '0';
    const sidebar = (
      <Sider width={240} className="custom_ant_sidebar addressSidebar"
        style={{ background: '#2071a7',color:'#fff',marginTop:sidebarMenuMarTop,overflow: 'auto' }}>
        <DocumentSidebar currentFileType={currentFileType} currentFileSubType={currentFileSubType} departmentData={departmentData}
          searchFormPC={this.refs.searchFormPC}
          setCurrentFileSubType={this.setCurrentFileSubType.bind(this)}
          setCurrentDepartment={this.setCurrentDepartment.bind(this)}
          onClickMenuItem={()=>{this.setState( {open:!this.state.open} ); }}
          handleSearch={this.handleSearch} />
      </Sider>
    );
    let finalEle = this.state.isMobile ? this.getMobileElements(sidebar) : this.getPCElements(sidebar);
    const editModalField = {
      ref: "editDocForm",
      visible: visibleEditModel,
      memberInfo: memberInfo,
      departmentData:departmentData,
      currentFileType: currentFileType,
      currentFileSubType: currentFileSubType,
      // currentDepartment: currentDepartment,
      handleSearch: this.handleSearch,
      handleCancelModal: this.handleCancelModal
    }
    return (<div className="document_container">
      {finalEle}
      {currentFileSubType == '律师' ? <DocumentEditLawyerModalPC {...editModalField}></DocumentEditLawyerModalPC> : <DocumentEditModalPC {...editModalField}></DocumentEditModalPC>}

    </div>);
  }
}

DocumentPage.defaultProps = {
};
DocumentPage.propTypes = {
};

export default DocumentPage;
