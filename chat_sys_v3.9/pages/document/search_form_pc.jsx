import React from 'react';
import UserStore from 'stores/user_store.jsx';

import { Form, Icon, Input, Button, Radio, Upload, message } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

import * as Utils from 'utils/utils.jsx';
import MyWebClient from 'client/my_web_client.jsx';

message.config({
  top: 75,
  duration: 2,
});

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SearchFormPC extends React.Component {
  constructor(props) {
      super(props);
      this.beforeUploadCall = this.beforeUploadCall.bind(this);
      this.fileUploadChange = this.fileUploadChange.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
      this.state = {
        isMobile: Utils.isMobile(),
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }
  componentDidMount() {
    // this.props.form.validateFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const param = {};
        Object.keys(values).forEach((key) => {
          if (values[key]) {
            param[key] = values[key];
          }
        });
        // console.log('Received search params: ', param);
        this.props.handleSearch(param);
      }
    });
  }
  handleGenderChange(e) {
    if (e.target.checked) {
      const searchFormPC = this.props.form;
      searchFormPC.setFieldsValue({
        gender: ''
      });
    }
  }
  beforeUploadCall(file) {
    // console.log('file beforeUploadCall :',file);
    let fileNameSplit = file.name.split('.');
    if(fileNameSplit[fileNameSplit.length-1] != "xlsx" && fileNameSplit[fileNameSplit.length-1] != "xls"){
      this.props.openNotification('info', '只能上传excel文档');
      return false;
    }
    return true;
  }
  fileUploadChange(obj) {
    // console.log('file upload change', obj);
    if(obj.file.status == "done" && obj.file.response == "success"){
      this.props.openNotification('success', '档案导入成功');
      this.props.handleSearch();
    } else if (obj.file.status == "error") {
      this.props.openNotification('error', '档案导入失败');
    }
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const uploadField = {
      name: 'file',
      action: this.props.currentFileSubType == '律师' ? MyWebClient.getLawyerfileInfoImportUrl() : MyWebClient.getfileInfoImportUrl(),
      headers:MyWebClient.defaultHeaders,
      showUploadList:false,
      accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      beforeUpload: this.beforeUploadCall,
      onChange: this.fileUploadChange
    }
    // "/static/template/" + (this.props.currentFileSubType == '律师' ? '律师人事档案模板' : '其他人事档案模板') + ".xlsx"
    return (
      <Form layout="inline"
        className="ant-advanced-search-form"
        onSubmit={this.handleSubmit}
        >
        {/*<FormItem label="部门" className="p-r-10">
          {getFieldDecorator('department')(
            <Input placeholder="" />
          )}
        </FormItem>*/}
        <FormItem label="姓名" className="p-r-10">
          {getFieldDecorator('userName')(
            <Input placeholder="" />
          )}
        </FormItem>
        <FormItem label="性别">
          {getFieldDecorator('gender')(
            <RadioGroup>
              <RadioButton value="男" onClick={this.handleGenderChange.bind(this)}>男</RadioButton>
              <RadioButton value="女" onClick={this.handleGenderChange.bind(this)}>女</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="">
          <button type="submit" className="btn btn-primary comment-btn"><Icon type="search" /> 搜索</button>
        </FormItem>
        {this.state.hasOperaPermission ? (<FormItem label="" className="" style={{marginRight: 0}}>
          <Upload {...uploadField}>
            <button type="button" className="btn btn-default"><Icon type="upload" /> 导入</button>
          </Upload>
          {this.props.currentFileSubType == '律师'?
            (
              <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
                href="http://matt.siteview.com/modle/LawyerFile.xlsx"><Icon type="download" /> 下载模板(律师)</a>
            ):
            (
              <a type="button" className="btn btn-info" style={{ marginLeft: '10px' }}
                href="http://matt.siteview.com/modle/personnelFiles.xlsx"><Icon type="download" /> 下载模板(人事)</a>
            )
          }
        </FormItem>) : null}
      </Form>
    );
  }
}
const WrappedSearchFormPC = Form.create()(SearchFormPC);

export default WrappedSearchFormPC;
