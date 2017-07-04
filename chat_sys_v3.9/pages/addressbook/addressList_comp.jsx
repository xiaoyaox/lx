import $ from 'jquery';
import React from 'react';
import moment from 'moment';

import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { Row, Col, Icon,notification, Input, Button as ButtonPc,Table, Pagination, Tooltip,Modal,message } from 'antd';

const confirm = Modal.confirm;
import signup_logo from 'images/signup_logo.png';
import avatorIcon_man from 'images/avator_icon/avator_man.png';
import avatorIcon_woman from 'images/avator_icon/avator_woman.png';
import avatorIcon01 from 'images/avator_icon/avator01.jpg';
import avatorIcon02 from 'images/avator_icon/avator02.jpg';
import avatorIcon03 from 'images/avator_icon/avator03.jpg';
import avatorIcon04 from 'images/avator_icon/avator04.jpg';
notification.config({
  top: 68,
  duration: 3
});

class AddressListComp extends React.Component {
  constructor(props) {
      super(props);
      this.showAddEditDialog = this.showAddEditDialog.bind(this);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      this.onSelectChange = this.onSelectChange.bind(this);
      this.confirmDeleteContacts = this.confirmDeleteContacts.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['address_book'].indexOf('action') != -1;
      this.state = {
        selectedRowKeys: [],  // Check here to configure the default column
        columns:[],
        permissionData:permissionData,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }

  componentWillMount(){
    const columns = [{
      title: '联系人',
      dataIndex: 'Contacts',
      render:(text,record,index) => (
          <div className="addressbook_row" key={record.id+123456}>
            <span className="addressbook_avator">
              <img className="member_icon" width="54" height="54" src={this.props.iconArr[index]}/>
            </span>
            <div className="addressbook_detail">
                <div className="member_name">
                  <span>({record.userName}) &nbsp;</span>
                  {this.state.hasOperaPermission ? (<div className="addressbook_oper">
                    <a href="javascript:;" onClick={()=>{this.showAddEditDialog(text,record,index)}}><Icon type="edit" />编辑</a>
                    <a href="javascript:;" onClick={()=>{this.showDeleteConfirmDialog(record)}} style={{color:'red',marginLeft:'15px'}}><Icon type="delete" />删除</a>
                  </div>):null}
                </div>
                <div className="member_email"><span>电子邮件：</span>{record.email}</div>
                <div className="member_phone"><span>电话号码：</span>{record.telephoneNumber+','+record.groupShortCode}</div>
            </div>
          </div>)
    }];
    this.setState({columns:columns});
  }
  componentDidMount(){

  }
  onClickDeleteContact = (text,record)=>{

  }
  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  showAddEditDialog(text,record,index){
    console.log("text:"+text+"index:"+index);
    let data = record || {};
    this.props.showAddEditDialog(data);
  }
  showDeleteConfirmDialog = (record)=>{
    let selectedIds = record.id ? [record.id] : this.state.selectedRowKeys;
    let _this = this;
    confirm({
      title: '确认删除吗 ?',
      content: '',
      onOk() {
        _this.confirmDeleteContacts(selectedIds);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  confirmDeleteContacts(contactsIds){ //删除用户
    if(!contactsIds || contactsIds.length<=0){ return; }
    contactsIds = contactsIds.join(',');
    console.log('ok',contactsIds);
    myWebClient.deleteContacts(contactsIds,
      (data,res)=>{
        notification.success({message: '联系人删除成功！'});
        console.log("联系人删除成功：",data);
        this.setState({ selectedRowKeys:[] });
        this.props.afterDeleteContactsCall();
      },(e,err,res)=>{
        notification.error({message: '联系人删除失败！'});
        console.log("delete 联系人 fialed!", err);
      }
    );
  }

  render() {
    const { columns, selectedRowKeys } = this.state;
    const { addressListData } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    let cls_name = "addressTableList " + this.props.className;
    return (
      <div className={cls_name}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
          {this.state.hasOperaPermission ? (<button type="button"
              className="btn btn-primary pull-right"
              disabled={hasSelected}
              onClick={()=>{this.showAddEditDialog('',null,null)}}>
              <Icon type="plus" />新增
            </button>
          ):null}
          {this.state.hasOperaPermission ? (
            <button type="button"
              className="btn btn-danger pull-right mr_10"
              disabled={!hasSelected}
              onClick={()=>this.showDeleteConfirmDialog({})}>
              <Icon type="delete" />批量删除
            </button>
          ):null}
        </div>
        <div className='addressbook_list' style={{width:'100%'}}>
          <Table rowSelection={rowSelection}
            columns={columns}
            showHeader={false}
            dataSource={addressListData}
            pagination={{ pageSize: 10 }}/>
        </div>
      </div>
    );
  }
}

AddressListComp.defaultProps = {
  iconArr : [avatorIcon_man,avatorIcon_woman, avatorIcon_man, avatorIcon_man,avatorIcon_man,avatorIcon_woman,avatorIcon_man,avatorIcon_man, avatorIcon_man,avatorIcon01,avatorIcon02,avatorIcon03]
};

AddressListComp.propTypes = {
  addressListData:React.PropTypes.array,
  showAddEditDialog:React.PropTypes.func,
  afterDeleteContactsCall:React.PropTypes.func,
  // organizationsFlatData:React.PropTypes.array,
  // organizationsFlatDataMap:React.PropTypes.object,
  className: React.PropTypes.string
};

export default AddressListComp;
