import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';
import * as organizationUtils from '../utils/organization_utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import superagent from 'superagent';

import { Row, Col, Icon, Input, Button as ButtonPc, Table,message,notification } from 'antd';
import {Modal as ModalAm} from 'antd-mobile';
const ModalAmAlert = ModalAm.alert;
notification.config({
  top: 68,
  duration: 3
});
class SysUsersListMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.showAddEditDialog = this.showAddEditDialog.bind(this);
      this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
      this.onSelectChange = this.onSelectChange.bind(this);
      this.state = {
        loading: false
      };
  }
  componentDidMount(){

  }
  showAddEditDialog(e){
    // console.log("点击了用户管理的编辑和新增按钮--：",e);
    this.props.showAddEditDialog({});
  }
  showDeleteConfirm(e){
    // console.log("点击了用户列表的某一条的删除按钮--：",e);
    this.props.showDeleteConfirmDialog(e);
  }
  showDeleteConfirmDialog = (userIds)=> {
    let _this = this;
    if (this.state.isMobile) {
      ModalAmAlert('删除', '确认删除吗 ?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确认', onPress: () => this.confirmDeleteUser(userIds), style: { fontWeight: 'bold' } },
      ]);
    }
  }
  confirmDeleteUser = (userIds)=>{ //删除用户
    userIds = userIds.join(',');
    console.log('ok',userIds);
    myWebClient.deleteUsers(userIds,
      (data,res)=>{
        notification.success({message: '用户删除成功！'});
        console.log("用户删除成功：",data);
        this.setState({ selectedRowKeys:[] });
        this.props.afterDeleteUserCall();
      },(e,err,res)=>{
        notification.error({message: '用户删除失败！'});
        console.log("delete users fialed!", err);
      }
    );
  }
  render() {
    const {  loading } = this.state;
    const { userListData } = this.props;
    let cls_name = "syssearchList " + this.props.className||'';
    return (
      <div className="am-sys-list sys-table">
        <List style={{ margin: '0.1rem 0', backgroundColor: 'white' }}>
          {userListData.map((item) => (
            <List.Item key={item.key}
              extra={<div>
                <a href="javascript:;" className="am-link" onClick={this.showAddEditDialog}><Icon type="edit" /> 编辑</a><br/>
                <a href="javascript:;" className="am-link" onClick={this.showDeleteConfirm}  style={{color:'red'}}><Icon type="delete"/> 删除</a>
                </div>}
              multipleLine
            >
              {item.nickname}
              <List.Item.Brief>
                用户名: {item.username}, 编辑权限: {item.roles}
              </List.Item.Brief>
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}

SysUsersListMobileComp.defaultProps = {
};

SysUsersListMobileComp.propTypes = {
  userListData:React.PropTypes.array,
  afterDeleteUserCall:React.PropTypes.func,
  showAddEditDialog:React.PropTypes.func,
  className: React.PropTypes.string
};

export default SysUsersListMobileComp;
