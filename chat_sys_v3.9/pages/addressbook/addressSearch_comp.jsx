import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import myWebClient from 'client/my_web_client.jsx';
import superagent from 'superagent';

import {InputItem,List} from 'antd-mobile';
import { Row, Col, Form, Icon, Input, Button as ButtonPc,Upload,message,notification } from 'antd';
const FormItem = Form.Item;
notification.config({
  top: 68,
  duration: 3
});
const formItemLayout4Search = {
  labelCol: {
    xs: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 },
  },
};
// 通讯录的查询区组件
class AddressSearchComp extends React.Component {
  constructor(props) {
      super(props);
      this.handleAddressSearch = this.handleAddressSearch.bind(this);
      this.beforeUploadCall = this.beforeUploadCall.bind(this);
      this.fileUploadChange = this.fileUploadChange.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['address_book'].indexOf('action') != -1;
      this.state = {
        permissionData:permissionData,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
        isMobile: Utils.isMobile()
      };
  }
  handleAddressSearch(e){
    e && e.preventDefault();
    console.log("handleSearch,通讯录点击查询--:",this.props.form.getFieldsValue());
    let val;
    if(this.state.isMobile){
      val = document.querySelector('.mobileSearchContainer input[name=filter]').value;
    }else{
      val = this.props.form.getFieldsValue().filter;
    }
    this.props.onSubmitSearchCall(val);
  }
  handleClearSearch = ()=>{ //清空查询区
    this.props.form.resetFields();
    this.handleAddressSearch(null);
  }

  beforeUploadCall(file) {
    console.log('file beforeUploadCall :',file);
    let fileNameSplit = file.name.split('.');
    if(fileNameSplit[fileNameSplit.length-1] != "xlsx" && fileNameSplit[fileNameSplit.length-1] != "xls"){
      notification.error({message: '你只能上传excel文档'});
      return false;
    }
    return true;
  }
  fileUploadChange(obj) {
    console.log('file upload change:',obj);
    if(obj.file.status=="done" && obj.file.response == "success"){
        this.props.onSubmitSearchCall('');
    }
  }

  getContactsSearchForm() {
    const { getFieldDecorator, getFieldsError, getFieldError } = this.props.form;
    const uploadField = {
      name: 'file',
      // action: 'http://192.168.9.39:10086/import/contacts',
      action: myWebClient.getContactsImportUrl(),
      headers:myWebClient.defaultHeaders,
      showUploadList:false,
      accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      beforeUpload: this.beforeUploadCall,
      onChange: this.fileUploadChange
    }
    let searchPCForm = (
      <div>
              <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleAddressSearch}
              >
              <Row type="flex" justify="space-around" align="middle" className=''>
                <Col span={12} className=''>
                  <FormItem label="关键字" {...formItemLayout4Search}>
                    {getFieldDecorator('filter', {
                    })(
                      <Input placeholder="用户名/邮箱/电话" />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="">
                    <button type="submit"
                      className="btn btn-primary"
                      ><Icon type="search" /> 搜索</button>
                    <button type="button"
                      style={{marginLeft: "10px"}}
                      onClick={this.handleClearSearch}
                      className="btn"
                      >清空</button>
                    {this.state.hasOperaPermission?(<span><Upload {...uploadField}>
                      <button type="button"
                        className="btn btn-default"
                        style={{ marginLeft: '20px' }}>
                        <Icon type="upload" /> 导入
                      </button>
                    </Upload>
                    <a type="button" className="btn btn-info"
                      style={{ marginLeft: '20px' }}
                       href={"http://"+window.serverUrl+"/modle/contacts.xlsx"}>下载模板</a></span>):null}
                  </FormItem>
                </Col>

              </Row>
              </Form>
      </div>
    )
    let searchMobileForm = (
      <div className="am-sys-list">
        <List className="mobileSearchContainer">
          <InputItem clear autoFocus placeholder="用户名/邮箱/电话" name='filter'>关键字</InputItem>
        </List>
        <div style={{ margin: '0.16rem' }}>
          <ButtonPc type="primary"><Icon type="search" onClick={this.handleAddressSearch}/> 搜索</ButtonPc>
        </div>
      </div>
    )

    return this.state.isMobile ? searchMobileForm : searchPCForm;
  }
  render() {
    let searchZoneEles = this.getContactsSearchForm();
    return (
      <div className={''}>
        {searchZoneEles}
      </div>
    );
  }
}

AddressSearchComp.defaultProps = {
};

AddressSearchComp.propTypes = {
  onSubmitSearchCall:React.PropTypes.func,
  className: React.PropTypes.string
};

export default Form.create()(AddressSearchComp);
