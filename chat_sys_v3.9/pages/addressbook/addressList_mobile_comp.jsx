import $ from 'jquery';
import React from 'react';

import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { Modal,SwipeAction,List } from 'antd-mobile';
import { Row, Col, Icon,notification, Input, Button as ButtonPc,Table, Pagination, Tooltip,message } from 'antd';
const alert = Modal.alert;
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

class AddressListMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.showAddEditDialog = this.showAddEditDialog.bind(this);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      this.confirmDeleteContacts = this.confirmDeleteContacts.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['address_book'].indexOf('action') != -1;
      this.state = {
        columns:[],
        isModalOpen:false,
        selectedIds:[],
        permissionData:permissionData,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }

  componentWillMount(){
    const columns = [{
      title: '联系人',
      dataIndex: 'Contacts',
      render:(text,record,index) => (
        <div key={record.id+123456}>
          <SwipeAction style={{ backgroundColor: '#f3f3f3' }}
            autoClose
            disabled={this.state.hasOperaPermission ? false : true}
            right={[
              {
                text: '取消',
                onPress: () => console.log('cancel'),
                style: { backgroundColor: '#ddd', color: 'white' },
              },
              {
                text: '删除',
                onPress: ()=>{this.showDeleteConfirmDialog(record)},
                style: { backgroundColor: '#F4333C', color: 'white' },
              },
            ]}
            onOpen={() => console.log('global open')}
            onClose={() => console.log('global close')}
            >
              <div className="addressbook_row">
                <span className="addressbook_avator">
                  <img className="member_icon" width="54" height="54" src={this.props.iconArr[index]}/>
                </span>
                <div className="addressbook_detail">
                    <div className="member_name">
                      <span>({record.userName}) &nbsp;</span>
                      {this.state.hasOperaPermission ? (<div className="addressbook_oper">
                        <a href="javascript:;" onClick={()=>{this.showAddEditDialog(text,record,index)}} style={{marginLeft:'1em'}}><Icon type="edit" />编辑</a>
                      </div>):null}
                    </div>
                    <div className="member_email"><span>电子邮件：</span>{record.email}</div>
                    <div className="member_phone"><span>电话号码：</span>{record.telephoneNumber+','+record.groupShortCode}</div>
                </div>
              </div>
          </SwipeAction>
        </div>
          )
    }];
    this.setState({columns:columns});
  }
  componentDidMount(){

  }
  onClickDeleteContact = (text,record)=>{

  }
  showAddEditDialog(text,record,index){
    console.log("text:"+text+"index:"+index);
    let data = record || {};
    this.props.showAddEditDialog(data);
  }
  showDeleteConfirmDialog = (record)=>{
    let selectedIds = record.id ? [record.id] : [];
    alert('删除', '确定删除么???', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.confirmDeleteContacts(selectedIds) },
    ]);
  }
  confirmDeleteContacts(contactsIds){ //删除用户
    if(!contactsIds || contactsIds.length<=0){ return; }
    contactsIds = contactsIds.join(',');
    console.log('ok',contactsIds);
    myWebClient.deleteContacts(contactsIds,
      (data,res)=>{
        notification.success({message: '联系人删除成功！'});
        console.log("联系人删除成功：",data);
        this.props.afterDeleteContactsCall();
      },(e,err,res)=>{
        notification.error({message: '联系人删除失败！'});
        console.log("delete 联系人 fialed!", err);
      }
    );
  }

  render() {
    const { columns } = this.state;
    const { addressListData } = this.props;
    let cls_name = "addressTableList " + this.props.className;
    return (
      <div className={cls_name}>
        <div style={{ marginBottom: 12 }}>
          {this.state.hasOperaPermission ? (<button type="button"
              className="btn btn-primary pull-right"
              style={{marginRight: '1em'}}
              onClick={()=>{this.showAddEditDialog('',null,null)}}>
              <Icon type="plus" />新增
            </button>
          ):null}
        </div>
        <div className='addressbook_list mobile_addressbook_list' style={{width:'100%'}}>
          <Table
            columns={columns}
            showHeader={false}
            dataSource={addressListData}
            pagination={{ pageSize: 10 }}/>
        </div>
      </div>
    );
  }
}

AddressListMobileComp.defaultProps = {
  iconArr : [avatorIcon_man,avatorIcon_woman, avatorIcon_man, avatorIcon_man,avatorIcon_man,avatorIcon_woman,avatorIcon_man,avatorIcon_man, avatorIcon_man,avatorIcon01,avatorIcon02,avatorIcon03]
};

AddressListMobileComp.propTypes = {
  addressListData:React.PropTypes.array,
  showAddEditDialog:React.PropTypes.func,
  afterDeleteContactsCall:React.PropTypes.func,
  className: React.PropTypes.string
};

export default AddressListMobileComp;
