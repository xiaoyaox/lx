import $ from 'jquery';
import React from 'react';
import UserStore from 'stores/user_store.jsx';
import OrganizationStore from 'pages/stores/organization_store.jsx';
import * as Utils from 'utils/utils.jsx';
import * as organizationUtils from '../utils/organization_utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import {Modal as ModalAm} from 'antd-mobile';
const ModalAmAlert = ModalAm.alert;
import { Row, Col, Icon, Input, Button as ButtonPc, notification,Table, Tooltip,message,Modal } from 'antd';
const confirm = Modal.confirm;

notification.config({
  top: 68,
  duration: 3
});

const adminOrganizationId = "c45385564ee24938920d31ec7f176b43";
class SysUsersListComp extends React.Component {
  constructor(props) {
      super(props);
      this.showAddEditDialog = this.showAddEditDialog.bind(this);
      this.showModifyPasswordDialog = this.showModifyPasswordDialog.bind(this);
      this.showDeleteOrActivateConfirm = this.showDeleteOrActivateConfirm.bind(this);
      this.onSelectChange = this.onSelectChange.bind(this);
      this.showEditPrivilegeDialog = this.showEditPrivilegeDialog.bind(this);
      this.updateOrganizationData = this.updateOrganizationData.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
      this.state = {
        selectedRowKeys: [],  // Check here to configure the default column
        columns:[],
        loading: false,
        organizationsData:[],
        organizationsFlatData:[],
        organizationsFlatDataMap:{},
        permissionData:permissionData,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
        sortedInfo: {
          order: 'ascend',
          columnKey: 'organizations',
        }
      };
  }
  getOrganizationsDesc(text,record,index){
    let eles=[];
    if(text){
      let organiArr = text.split(',');
      eles = organiArr.map((val,i)=>{
        let obj = this.state.organizationsFlatDataMap[val]||{};
        return (<p key={obj.id+record.id+i}>{obj.name}</p>);
      });
    }
    return eles;
  }
  sortColumns = (itemA,itemB,colName)=>{
    if(colName == "organizations"){
      if(itemB.username == "admin"){
        return 1;
      }
      if(itemB.organizations.indexOf(adminOrganizationId) != -1){
        return 1;
      }else{
        return -1;
      }
    }
    return 0;
  }
  componentWillMount(){
    this.updateOrganizationData();
    OrganizationStore.addOrgaChangeListener(this.updateOrganizationData);
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
  componentDidMount(){
    let {hasOperaPermission} = this.state;
    const columns = [{
      title: '用户名',
      dataIndex: 'username'
    }, {
      title: '姓名',
      dataIndex: 'nickname'
    }, {
      title: '组织',
      dataIndex: 'organizations',
      // width: '10%',
      sorter: (a, b) => this.sortColumns(a,b,'organizations'),
      sortOrder: this.state.sortedInfo.columnKey === 'organizations' && this.state.sortedInfo.order,
      render: (text,record,index)=>(<span>{this.getOrganizationsDesc(text,record,index)}</span>)
    }, {
      title: '电话',
      dataIndex: 'phone'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '状态',
      dataIndex: 'effective',
      // sorter: (a, b) =>  this.sortColumns(a,b,'effective'),
      render:(text, record, index) => {
        if(text){
          return (<span style={{color:'green'}}><Icon type="user-add" />有效</span>);
        }else{
          return (<span  style={{color:'red'}}><Icon type="user-delete" />失效</span>);
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '15%',
      render: (text, record, index) => {
        return hasOperaPermission?
          (<div>
              <a href="javascript:;" onClick={()=>{this.showAddEditDialog(text,record,index)}}><Icon type="edit" />编辑</a>
              <span className="ant-divider" />
              <a href="javascript:;"
                 onClick={()=>{this.showDeleteOrActivateConfirm(text,record,index)}}
                 style={{color:record.effective?'red':'green'}}>
                 <Icon type={record.effective?"delete":"user-add"} />{record.effective?"删除":"激活"}
              </a>
              <span className="ant-divider" />
              <a href="javascript:;" onClick={()=>{this.showModifyPasswordDialog(text,record,index)}}><Icon type="setting" />修改密码</a>
            </div>):
          (<span>没有权限</span>);
      }
    }];
    this.setState({columns:columns});
  }

  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  showAddEditDialog(text,record,index){
    // console.log("点击了用户管理的编辑和新增按钮--：",record);
    console.log("text:"+text+"index:"+index);
    let data = record || {effective:true};
    this.props.showAddEditDialog(data);
  }
  showModifyPasswordDialog(text,record,index){
    // console.log("点击了用户管理的编辑和新增按钮--：",record);
    console.log("text:"+text+"index:"+index);
    let data = record || {effective:true};
    this.props.showModifyPasswordDialog(data);
  }
  showDeleteOrActivateConfirm(text,record,index){//删除一行
    // console.log("点击了用户列表的某一条的删除按钮--：",record);
    if(record.effective){
      if(record.username == "admin" || record.username == "administrator" || record.username == "管理员"){
        notification.warning({message: "管理员不能删除"});
        return;
      }
      this.showDeleteConfirmDialog([record.id]);
    }else{
      myWebClient.addOrEditUser("update",Object.assign({},record,{effective:true}),
        (data,res)=>{
          this.props.afterDeleteUserCall();
          notification.success({message: '用户重新激活成功！'});
        },(e,err,res)=>{
          notification.error({message: '用户重新激活失败！'});
        });
    }
  }

  batchDeleteUserConfirm = ()=>{
    let userIds = this.state.selectedRowKeys;
    let adminUsers = this.props.userListData.filter((item)=>{
      if(item.username == "admin" || item.username == "administrator" || item.username == "管理员"){
        if(userIds.indexOf(item.id) != -1){
          return true;
        }
      }
    });
    if(adminUsers.length>0){
        notification.warning({message: "管理员不能删除"});
      return;
    }
    this.showDeleteConfirmDialog(userIds);
  }
  showDeleteConfirmDialog = (userIds)=> {
    let _this = this;
    if (this.state.isMobile) {
      ModalAmAlert('删除', '确认删除吗 ?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确认', onPress: () => this.confirmDeleteUser(userIds), style: { fontWeight: 'bold' } },
      ]);
    } else {
      confirm({
        title: '确认删除吗 ?',
        content: '',
        onOk() {
          _this.confirmDeleteUser(userIds);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }
  confirmDeleteUser = (userIds)=>{ //删除用户
    userIds = userIds.join(',');
    console.log('ok',userIds);
    myWebClient.deleteUsers(userIds,
      (data,res)=>{
          notification.success({message: "用户删除成功！"});
        console.log("用户删除成功：",data);
        this.setState({ selectedRowKeys:[] });
        this.props.afterDeleteUserCall();
      },(e,err,res)=>{
        notification.error({message: "用户删除失败！"});
        console.log("delete users fialed!", err);
      }
    );
  }

  showEditPrivilegeDialog(text,record,index){
    console.log("点击了用户列表编辑权限按钮--：",text);
  }

  render() {
    const { columns, loading, selectedRowKeys } = this.state;
    const { userListData } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    let cls_name = "syssearchList " + this.props.className;
    return (
      <div className={cls_name}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
          {this.state.hasOperaPermission?(<button type="button"
            className="btn btn-primary pull-right"
            disabled={hasSelected}
            onClick={()=>{this.showAddEditDialog('',null,null)}}>
            <Icon type="plus" />添加
          </button>):null}
          {this.state.hasOperaPermission?(<button type="button"
            className="btn btn-danger pull-right mr_10"
            disabled={!hasSelected}
            onClick={()=>this.batchDeleteUserConfirm()}>
            <Icon type="delete" />批量删除
          </button>):null}
        </div>
        <div style={{width:'100%'}}>
          <Table rowSelection={rowSelection}
            columns={columns}
            dataSource={userListData}
            pagination={{ pageSize: 10 }}/>
        </div>
      </div>
    );
  }
}

SysUsersListComp.defaultProps = {
};

SysUsersListComp.propTypes = {
  userListData:React.PropTypes.array,
  afterDeleteUserCall:React.PropTypes.func,
  showAddEditDialog:React.PropTypes.func,
  showModifyPasswordDialog:React.PropTypes.func,
  className: React.PropTypes.string
};

export default SysUsersListComp;
